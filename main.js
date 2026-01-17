
document.addEventListener("DOMContentLoaded", () => {
  const desk = document.createElement("div");
  desk.classList.add("desk");
  const body = document.body;
  body.appendChild(desk);
  windowIdCounter = 0;
  const activeWindows = {};
  hMenu = false;
  zIndexCounter = 0;

  //  Right click desktop menu & preventing rightclick default menu

  /*document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });*/

  let rightClick = false;
  let rCMenu = null;

  desk.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.closest(".icon") || e.target.closest(".flatbar")) {
      if (rightClick && rCMenu) {
        rCMenu.remove();
        rightClick = false;
      }
      return;
    };


    if (rightClick && rCMenu) {
      rCMenu.remove();
      rightClick = false;
    }
    rCMenu = document.createElement("div");
    rCMenu.classList.add("rCMenu");
    rCMenu.id = "rcmenu";

    Object.assign(rCMenu.style, {
      top: `${e.clientY}px`,
      left: `${e.clientX}px`,
      zIndex: windowIdCounter++
    });

    const configuration = document.createElement("div");
    configuration.classList.add("right-click-cfg");
    rCMenu.appendChild(configuration);

    const changeBackG = document.createElement("div");
    changeBackG.classList.add("change-bg");
    rCMenu.appendChild(changeBackG);

    desk.appendChild(rCMenu);
    rightClick = true;
  });


  document.addEventListener("click", () => {
    if (rightClick && rCMenu) {
      rCMenu.remove();
      rightClick = false;
    }
  });

  // ---- Icons Grid ----
  const iconsGrid = document.createElement("div");
  iconsGrid.classList.add("icons-grid");

  const icons = [
    { id: "browser", text: "Browser", className: "fa-solid fa-globe fa" },
    //{ id: "game", text: "Game", className: "fa-solid fa-gamepad fa" },
    { id: "terminal", text: "Terminal", className: "fa-solid fa-terminal fa" },
    { id: "calculator", text: "Maths", className: "fa-solid fa-calculator fa" },
    { id: "about", text: "About", className: "fa-solid fa-frog fa" },
    { id: "to-do", text: "To do", className: "fa-solid fa-list-alt fa" }
  ];

  icons.forEach(({ id, text, className }) => {
    const icon = document.createElement("span");
    icon.className = "desktop-icon";
    icon.draggable = true;
    icon.id = id + icon.className;
    const idGiven = icon.id;
    const iconImg = document.createElement("i");
    Object.assign(iconImg.style, {
      //backgroundColor: "black",
      color: "black",
      padding: "10px",
      //textShadow: "0.2px 0.2px 0.5px white"
    });

    iconImg.className = className + "-3x";
    icon.className = "icon";


    const iconText = document.createElement("div");
    iconText.className = "icon-text";
    iconText.textContent = text;

    icon.appendChild(iconImg);
    icon.appendChild(iconText);
    icon.ondblclick = () => {
      program = text;
      let idGiven = "" + windowIdCounter;
      createWindow(idGiven, program);
    }
    iconsGrid.appendChild(icon);
    icon.onmouseenter = () => {
      const iconSelected = document.getElementById(idGiven);
      iconSelected.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
    }
    icon.onmouseleave = () => {
      const iconSelected = document.getElementById(idGiven);
      iconSelected.style.boxShadow = "none";
    }
  });



  desk.appendChild(iconsGrid);

  // ---- Create Window & Taskbar Icon ----



  function createWindow(givenId, programGiven) {
    let isOnScreen = true;
    windowIdCounter++;
    const windowDiv = document.createElement("div");
    windowDiv.className = "window";
    windowDiv.id = givenId;
    if (!activeWindows[windowDiv.id]) {
      activeWindows[windowDiv.id] = {
        currentX: 0,
        currentY: 0,
        isMaximized: false,
        isDragging: false,
        id: windowDiv.id
      }
    }

    Object.assign(windowDiv.style, {
      zIndex: "" + (zIndexCounter + 1)
    });

    zIndexCounter = zIndexCounter + 1;
    const headerBar = document.createElement("div");
    headerBar.className = "window-header-bar";
    headerBar.id = "header" + givenId;

    const programIcon = document.createElement("i");
    icons.forEach(({ text, className }) => {
      if (programGiven == text) programIcon.className = className;
    });
    programIcon.style.margin = "15px";

    const windowButtonsGrid = document.createElement("div");
    windowButtonsGrid.className = "window-buttons-grid";
    windowButtonsGrid.id = "button-grid" + windowDiv.id;
    const createButton = (label, id = null, className) => {
      const btn = document.createElement("button");
      btn.className = "window-button";
      btn.id = id + label + "btn";
      const btnIcon = document.createElement("i");
      btnIcon.className = className;
      btn.appendChild(btnIcon);
      btn.onmouseenter = () => {
        const iconSelected = document.getElementById(btn.id);
        iconSelected.style.boxShadow = "0 0 5px rgba(255,255,255,0.5)";
      }
      btn.onmouseleave = () => {
        const iconSelected = document.getElementById(btn.id);
        iconSelected.style.boxShadow = "none";
      }
      // Window buttons functions
      btn.onclick = () => {
        if (label == "c") {
          const windowSelected = document.getElementById(windowDiv.id);
          activeWindows[windowSelected.id].isDragging = false;
          const taskBar = document.getElementById("taskbar" + id);
          taskBar.remove();
          delete activeWindows[windowSelected.id]
          windowSelected.remove();



        }
        if (label == "m") {
          const windowSelected = document.getElementById(windowDiv.id);
          if (isOnScreen) {
            windowSelected.style.display = "flex";
            windowSelected.style.position = "fixed";
            windowSelected.style.width = "500px";
            windowSelected.style.height = "500px";
            windowSelected.style.left = "35%";
            windowSelected.style.top = "20%";
            windowSelected.style.borderRadius = "15px";
            isOnScreen = false;
          }

          windowSelected.style.opacity = "0";
          windowSelected.style.pointerEvents = "none";

        }
        if (label == "r") {
          const windowSelected = document.getElementById(windowDiv.id);

          if (!activeWindows[windowSelected.id].isMaximized) {
            activeWindows[windowSelected.id].prevX = activeWindows[windowSelected.id].currentX;
            activeWindows[windowSelected.id].prevY = activeWindows[windowSelected.id].currentY;
            activeWindows[windowSelected.id].top = windowSelected.style.top;
            activeWindows[windowSelected.id].left = windowSelected.style.left;
            //windowSelected.style.position = "absolute";
            windowSelected.style.transform = "translate(0px, 0px)";
            windowSelected.style.top = "0";
            windowSelected.style.left = "0";
            windowSelected.style.width = "100vw";
            windowSelected.style.height = "calc(100vh - 50px)";
            windowSelected.style.borderRadius = "0";
            windowSelected.style.position = "absolute";
            windowSelected.style.zIndex = "" + (zIndexCounter + 1);
            zIndexCounter = zIndexCounter + 1;
            activeWindows[windowSelected.id].isMaximized = true;

          }
          else {

            windowSelected.style.display = "flex";
            windowSelected.style.position = "fixed";
            windowSelected.style.width = "500px";
            windowSelected.style.height = "500px";
            windowSelected.style.top = activeWindows[windowSelected.id].top;
            windowSelected.style.left = activeWindows[windowSelected.id].left;
            windowSelected.style.borderRadius = "15px";
            windowSelected.style.transform = `translate(${activeWindows[windowSelected.id].prevX}px, ${activeWindows[windowSelected.id].prevY}px)`;
            activeWindows[windowSelected.id].currentX = activeWindows[windowSelected.id].prevX;
            activeWindows[windowSelected.id].currentY = activeWindows[windowSelected.id].prevY;
            activeWindows[windowSelected.id].isMaximized = false;

          }
        }
      }
      return btn;
    };


    windowButtonsGrid.appendChild(createButton("m", givenId, "fa-solid fa-circle-minus fa-lg"));
    if (programGiven != "Maths") { windowButtonsGrid.appendChild(createButton("r", givenId, "fa-solid fa-circle-chevron-up fa-lg")); }
    windowButtonsGrid.appendChild(createButton("c", givenId, "fa-solid fa-circle-xmark fa-lg"));

    createTaskIcon(givenId, programGiven);

    function createTaskIcon(givenId, programGiven) {
      const activeProgram = document.createElement("button");
      activeProgram.id = "taskbar" + givenId;
      activeProgram.className = "active-program";
      activeProgram.onclick = () => {
        const windowSelected = document.getElementById(givenId);
        if (windowSelected.style.opacity == "1") {
          windowSelected.style.opacity = "0";
          windowSelected.style.pointerEvents = "none";
        }
        else {
          windowSelected.style.opacity = "1";
          windowSelected.style.pointerEvents = "auto";
          windowSelected.style.zIndex = zIndexCounter + 1;
          zIndexCounter++;
        }
      }

      const taskIcon = document.createElement("i");
      icons.forEach(({ text, className }) => {
        if (programGiven == text) taskIcon.className = className + " fa-2x";
        taskIcon.id = "task" + givenId;
      });
      activeProgram.appendChild(taskIcon);
      runningPrograms.appendChild(activeProgram);

      activeProgram.onmouseenter = () => {
        const iconSelected = document.getElementById(activeProgram.id);
        iconSelected.style.boxShadow = "0 0 5px rgba(255,255,255,0.5)";
      }
      activeProgram.onmouseleave = () => {
        const iconSelected = document.getElementById(activeProgram.id);
        iconSelected.style.boxShadow = "none";
      }


    }

    //      Window Dragging

    //currentX = 0;
    //currentY = 0;
    startX = 0;
    startY = 0;
    headerBar.addEventListener("mousedown", (e) => {
      activeWindows[windowDiv.id].isDragging = true;
      if (activeWindows[windowDiv.id].isMaximized) return;
      windowDiv.style.position = "absolute";
      windowDiv.style.zIndex = "" + (zIndexCounter + 1);
      zIndexCounter = zIndexCounter + 1;
      startX = e.clientX;
      startY = e.clientY;
      e.preventDefault();

    });
    document.addEventListener("mousemove", (e) => {
      if (activeWindows[windowDiv.id] == null || !activeWindows[windowDiv.id].isDragging) return;
      if (activeWindows[windowDiv.id].isMaximized) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      const newX = activeWindows[windowDiv.id].currentX + dx;
      const newY = activeWindows[windowDiv.id].currentY + dy;
      windowDiv.style.transform = `translate(${newX}px, ${newY}px)`;
    });

    document.addEventListener('mouseup', (e) => {
      if (activeWindows[windowDiv.id] == null || !activeWindows[windowDiv.id].isDragging) return;
      activeWindows[windowDiv.id].isDragging = false;

      activeWindows[windowDiv.id].currentX += e.clientX - startX;
      activeWindows[windowDiv.id].currentY += e.clientY - startY;
      windowDiv.style.position = "fixed";

    });


    // Window pop on click

    windowDiv.addEventListener("click", () => {
      windowDiv.style.zIndex = "" + (zIndexCounter + 1);
      zIndexCounter = zIndexCounter + 1;
    })

    headerBar.appendChild(programIcon);
    headerBar.appendChild(windowButtonsGrid);
    windowDiv.appendChild(headerBar);
    body.appendChild(windowDiv);

    // Browser

    if (programGiven == "Browser") {
      guideId = null;
      btnsContainerId = null;
      wasButton = false;
      listOfSites = [];
      actualPage = 0;
      pageLeapSave = 0;
      const browser = document.getElementById(windowDiv.id);
      browser.className = "browser";
      browser.style.zIndex = "" + (zIndexCounter + 1);

      // Nav bar

      const navBar = document.createElement("div");
      navBar.className = "browser-nav-bar";
      browser.appendChild(navBar);

      const btnContainer = document.createElement("div");
      btnContainer.className = "browser-nav-btn-container";
      navBar.appendChild(btnContainer);

      const navBtns = [
        { id: "backward", className: "fa-solid fa-arrow-left fa" },
        { id: "forward", className: "fa-solid fa-arrow-right fa" },
        { id: "reload", className: "fa-solid fa-rotate-left fa" },
      ];

      navBtns.forEach(({ id, className }, index) => {
        const nbtn = document.createElement("div");
        const nIcon = document.createElement("i");
        nbtn.id = "navBtn" + id + givenId;
        nIcon.className = className;
        Object.assign(nbtn.style, {
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          width: "33%",
          hegith: "100%",
          padding: "7px",
          margin: "5px",
          color: "white",
        });
        nbtn.onmouseenter = () => {
          const iconSelected = document.getElementById(nbtn.id);
          iconSelected.style.boxShadow = "0 0 5px rgba(255,255,255,0.5)";
        }
        nbtn.onmouseleave = () => {
          const iconSelected = document.getElementById(nbtn.id);
          iconSelected.style.boxShadow = "none";
        }
        nbtn.appendChild(nIcon);
        btnContainer.appendChild(nbtn);

        // Nav buttons functions
        switch (navBtns[index].id) {
          case "backward":
            nbtn.onclick = () => {
              if (actualPage > 0 ) {
                actualPage--;
                wasButton = true;
                webSearch(listOfSites[actualPage]);
              }
            }
            break;
          case "forward":
            nbtn.onclick = () => {
              if (actualPage < listOfSites.length-1) {
                actualPage++;
                wasButton = true;
                webSearch(listOfSites[actualPage]);
              }
            }
            break;
        }

      });

      // Search bar

      const searchBar = document.createElement("div");
      searchBar.classList = "browser-search-bar";
      searchBar.id = "searchBar" + givenId;
      const searchIcon = document.createElement("i");
      searchIcon.className = "fa-solid fa-magnifying-glass";
      Object.assign(searchIcon.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        hegith: "100%",
        color: "white"
      });

      const adressBar = document.createElement("input");
      adressBar.className = "browser-adress-bar";
      adressBar.placeholder = "https://...";
      adressBar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          webSearch();
        }
      });

      function webSearch(rawInput) {
        actualSite = rawInput ?? adressBar.value.trim();

        let input = rawInput ?? adressBar.value.trim();
        if (!wasButton && actualSite != "") {
          listOfSites = listOfSites.slice(0, actualPage + 1);
          listOfSites.push(actualSite);
          actualPage = listOfSites.length-1;
        }
        wasButton = false;
        console.log(actualPage);
        console.log(listOfSites);

        if (!input) {
          fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://wikipedia.org')}`)
            .then(response => {
              if (response.ok) return response.json()
              throw new Error('Network response was not ok.')
            })
            .then(data => webContent.src = data);
        }

        const isProbablyUrl = input.startsWith("https://") || input.includes(".");

        if (isProbablyUrl) {
          if (!input.startsWith("https://")) {
            input = "https://" + input;
          }
          webContent.src = input;
        }
        const guide = document.getElementById(guideId);
        if (guide != null) { guide.remove(); };
        const pageBtns = document.getElementById(btnsContainerId);
        if (pageBtns != null) { pageBtns.remove() };
      }

      searchBar.appendChild(searchIcon);
      searchBar.appendChild(adressBar);
      navBar.appendChild(searchBar);

      // Go Button

      const goBtnContainer = document.createElement("div");
      goBtnContainer.className = "go-btn-container";
      const goBtn = document.createElement("i");
      goBtnContainer.id = "goBtn" + givenId;
      goBtn.className = "fa-solid fa-arrow-right fa";
      Object.assign(goBtn.style, {
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        width: "33%",
        padding: "5px",
        margin: "2px",
        color: "white",
      });
      goBtnContainer.onmouseenter = () => {
        const iconSelected = document.getElementById(goBtnContainer.id);
        iconSelected.style.boxShadow = "0 0 5px rgba(255,255,255,0.5)";
      }
      goBtnContainer.onmouseleave = () => {
        const iconSelected = document.getElementById(goBtnContainer.id);
        iconSelected.style.boxShadow = "none";
      }
      goBtnContainer.onclick = () => {
        webSearch();
      }
      goBtnContainer.appendChild(goBtn);
      searchBar.appendChild(goBtnContainer);

      // How to use the browser

      const guideContainer = document.createElement("div");
      guideContainer.id = "guide" + windowDiv.id;
      guideId = guideContainer.id;
      const guideText = document.createElement("p");
      guideContainer.classList.add("guide-container");
      guideText.classList.add("guide-text");
      guideText.textContent = "Some websites may not load here. \n \n \
                                These sites have been tested and work well:";
      browser.appendChild(guideContainer);
      guideContainer.appendChild(guideText);

      // Web access buttons
      const btnsContainer = document.createElement("div");
      btnsContainer.id = windowDiv.id + "web-btns";
      btnsContainerId = btnsContainer.id;
      btnsContainer.classList.add("browser-pages-container");
      browser.appendChild(btnsContainer);
      const listOfBtns = ["Frog-Os", "Wikipedia", "Mythic\nspoiler"];
      const listOfWebs = ["https://agelar01.github.io/", "wikipedia.org", "mythicspoiler.com"]
      listOfBtns.forEach((btn, index) => {
        const browserBtn = document.createElement("button");
        browserBtn.id = btn;
        browserBtn.classList.add("browser-btn");
        btnsContainer.appendChild(browserBtn);
        browserBtn.textContent = listOfBtns[index];
        browserBtn.onclick = () => {
          webSearch(listOfWebs[index]);
        }
      });




      // Iframe

      const webContent = document.createElement("iframe");
      Object.assign(webContent.style, {
        border: "none",
        width: "100%",
        flexGrow: "1"
      });



      browser.appendChild(webContent);


    }

    // Calculator

    if (programGiven == "Maths") {
      const container = document.getElementById(windowDiv.id);
      windowButtonsGrid.style.width = "66px";
      container.classList.add("calculator-main-container");
      //Display 

      const display = document.createElement("div");
      display.classList = ("calculator-display");
      container.appendChild(display);

      // Buttton box and buttons
      const buttonBox = document.createElement("div");
      buttonBox.classList = "calculator-button-box";
      buttonSigns = ["√", "7", "4", "1", "0", "DEL", "8", "5", "2", ".", "AC", "9", "6", "3", "%", "+", "-", "×", "÷", "="];
      for (i = 0; i < 20; i++) {
        const btn = document.createElement("div");
        btn.className = "calculator-btn";
        btn.textContent = buttonSigns[i];
        btn.addEventListener("keydown", event);
        btn.onclick = () => {
          if (display.textContent.length < 13 && display.textContent !== "Syntax Error") {
            if (btn.textContent !== "%" && btn.textContent !== "DEL" &&
              btn.textContent !== "AC" && btn.textContent !== "="
            ) displayAddInput(btn.textContent);
          }
          if (btn.textContent === "AC") display.textContent = "";
          if (btn.textContent === "DEL" && display.textContent !== "Syntax Error") display.textContent = display.textContent.slice(0, -1);
          if (btn.textContent === "=") calculate();
          if (btn.textContent === "%") display.textContent = percentage(parseFloat(display.textContent));

        }
        buttonBox.appendChild(btn);

      }
      container.appendChild(buttonBox);

      /* ! Al hacer los botones recordar border outline e inline para dar sensación de relieve y presionar */

      //Button functions 

      function displayAddInput(btnText) {
        if (display.textContent.includes(".") && btnText === ".") return;
        display.textContent = display.textContent + btnText;
      }

      // Operation functions

      function add(a, b) {
        return a + b;
      }
      function sub(a, b) {
        return a - b;
      }
      function mult(a, b) {
        return a * b;
      }
      function div(a, b) {
        return a / b;
      }
      function sqrt(a) {
        return Math.sqrt(a);
      }
      function percentage(a) {
        if (!["+", "-", "√", "%", "÷", "×"].includes(display.textContent)) return a / 100;

        return percentage(a);
      }

      //Calculus solving

      /* function calculate () {
          splitTheCalculus();
          switch ()
      }
          */

      function calculate() {
        entireFormula = display.textContent.split("");
        numAndOp = [];
        number = 0;
        operators = ["+", "-", "√", "%", "÷", "×"];

        //Creates an array with the numbers and the operators
        for (i = 0; i < entireFormula.length; i++) {
          if (operators.includes(entireFormula[i]) &&
            operators.includes(entireFormula[i + 1]) &&
            entireFormula[i + 1] !== "√") return display.textContent = "Syntax Error";

          if (!operators.includes(entireFormula[i])) {
            if (numAndOp[number] === undefined) numAndOp[number] = "";
            numAndOp[number] = numAndOp[number] + entireFormula[i];
            continue;
          }
          number++;
          numAndOp[number] = entireFormula[i];
          number++;
        }

        expRed();

        //Calculates the expression reducing from mult/div to sum/sub and returns the result
        function expRed() {
          for (i = 0; i < numAndOp.length; i++) {
            if (!operators.includes(numAndOp[i])) continue;
            if (numAndOp[i].includes("√")) {
              numAndOp[i] = sqrt(parseFloat(numAndOp[i + 1]));
              numAndOp.splice(i + 1, 1);
              numAndOp.splice(i - 1, 1);
              continue;
            }
            if (numAndOp[i].includes("×") && !numAndOp.includes("√")) {
              numAndOp[i] = mult(parseFloat(numAndOp[i - 1]), parseFloat(numAndOp[i + 1]));
              numAndOp.splice(i + 1, 1);
              numAndOp.splice(i - 1, 1);
              continue;
            }
            if (numAndOp[i].includes("+") && !numAndOp.includes("×") && !numAndOp.includes("√")) {
              numAndOp[i] = add(parseFloat(numAndOp[i - 1]), parseFloat(numAndOp[i + 1]));
              numAndOp.splice(i + 1, 1);
              numAndOp.splice(i - 1, 1);
              continue;
            }
            if (numAndOp[i].includes("-") && !numAndOp[i].includes("×") && !numAndOp.includes("√")) {
              numAndOp[i] = sub(parseFloat(numAndOp[i - 1]), parseFloat(numAndOp[i + 1]));
              numAndOp.splice(i + 1, 1);
              numAndOp.splice(i - 1, 1);
              continue;
            }
            if (numAndOp[i].includes("÷") && numAndOp.length === 3) {
              numAndOp[i] = div(parseFloat(numAndOp[i - 1]), parseFloat(numAndOp[i + 1]));
              numAndOp.splice(i + 1, 1);
              numAndOp.splice(i - 1, 1);
              continue;
            }
          }
          if (numAndOp.length !== 1) expRed();
          if (numAndOp.length === 1) {
            if (numAndOp[0].toString().length > 9) return display.textContent = numAndOp[0].toFixed(9);
            display.textContent = numAndOp[0];
          }
        }
      }
    }
    // Terminal



    if (programGiven == "Terminal") {
      // Terminal window
      paraId = 0;
      paragraphList = [];
      paraOnScreen = [];
      inputPointer = null;
      inputId = null;
      inputExists = false;
      const container = document.getElementById(windowDiv.id);
      container.classList.add("terminal-window");
      container.style.zIndex = "" + (zIndexCounter + 1);

      //Create paragraph

      function createParagraph(textContent) {
        const paragraph = document.createElement("div");
        paragraph.style.width = windowDiv.style.width;
        Object.assign(paragraph.style, {
          color: "white",
          fontFamily: "'Lucida Console', monospace",
          margin: "5px",
        });
        paragraph.id = "para" + paraId;
        paraId++;
        paragraph.textContent = textContent;
        paraOnScreen.push(textContent);
        paragraphList.push(paragraph.id);
        container.appendChild(paragraph);
        const input = document.getElementById(inputPointer);
        container.appendChild(input);
        const inputFocus = document.getElementById(inputId);
        inputFocus.focus();


      }

      // Create Input
      function createInput() {
        inputExists = true;
        let inputContainer = document.createElement("div");
        inputContainer.style.width = windowDiv.style.width;
        Object.assign(inputContainer.style, {
          color: "white",
          fontFamily: "'Lucida Console', monospace",
          margin: "5px",
          justifySelf: "end"
        });
        inputContainer.id = "input" + windowDiv.id;
        inputPointer = inputContainer.id;
        inputContainer.textContent = "user@FrogOs:~$";
        container.appendChild(inputContainer);
        const input = document.createElement("input");
        Object.assign(input.style, {
          color: "white",
          fontFamily: "'Lucida Console', monospace",
          width: "50%",
          background: "transparent",
          borderStyle: "none",
          outline: "none",
          fontSize: "inherit",


        });

        // Listening to commands or printing text
        input.id = "pointer" + windowDiv.id;
        inputId = input.id;
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            const comando = event.target.value.trim();
            event.target.value = "";

            switch (comando) {
              case "calculator":
                createWindow(windowIdCounter, "Maths");
                createParagraph(`user@FrogOs:~$ ${comando}`);
                break;

              case "browser":
                createParagraph(`user@FrogOs:~$ ${comando}`);
                createWindow(windowIdCounter, "Browser")
                break;
              case "clear":
                if (paragraphList.length > 0) {
                  paragraphList.forEach(id => {
                    document.getElementById(id)?.remove();
                  });
                  paragraphList = [];
                  paraOnScreen = [];
                }
                break;

              case "help":
                createParagraph(`user@FrogOs:~$ ${comando}`);
                createParagraph("List of commands: curiosity,calculator,browser,clear, help");
                break;
              case "curiosity":
                createParagraph(`user@FrogOs:~$ ${comando}`);
                const bannedWords = [
                  "sex", "sexual", "penis", "vagina", "porn",
                  "orgasm", "masturb", "fetish", "nude",
                  "fuck", "shit", "asshole", "eyaculation", "inseminate"
                ];


                function isSafe(text) {
                  const lower = text.toLowerCase();
                  return !bannedWords.some(word => lower.includes(word));
                }
                async function curiosityCommand() {
                  for (let i = 0; i < 5; i++) { // intentos
                    const res = await fetch(
                      "https://uselessfacts.jsph.pl/random.json?language=en"
                    );
                    const data = await res.json();

                    if (isSafe(data.text)) {
                      createParagraph(data.text);
                      return;
                    }
                  }
                }
                curiosityCommand();
                break;
              default:
                createParagraph(`user@FrogOs:~$ ${comando}`);
                createParagraph(`bash: ${comando}: command not found`);

              //refresh();

            }
          }
        });
        inputContainer.appendChild(input);
      }

      createInput();
      createParagraph("Type 'help' for a list of commands");
    }
    // About

    if (programGiven == "About") {
      const about = document.getElementById(windowDiv.id);
      about.classList.add("about-window");
      const text1 = document.createElement("p");
      text1.classList.add("about-text");
      const title1 = document.createElement("h2");
      title1.textContent = "FrogOs";
      title1.classList.add("title1");
      const title2 = document.createElement("h2");
      title2.textContent = "About me";
      title2.classList.add("title1");
      const text2 = document.createElement("p");
      text2.classList.add("about-text");
      text2.textContent =
        "My name is Antú Eyaralar. I have a little background in Computer Science \n\
        and a strong curiosity about how things work.";

      text1.textContent =
        "FrogOS is a desktop-like interface built to explore HTML, CSS, and JavaScript.\n\
          It's an ongoing work in progress.";

      about.appendChild(title1);
      about.appendChild(text1);
      about.appendChild(title2);
      about.appendChild(text2);
      //about.transition = "transform(-150,-60)";
    }

    //To Do

    if (programGiven == "To do") {
      const toDo = document.getElementById(windowDiv.id);
      toDo.classList.add("todo-window");
      const list = document.createElement("ul");
      list.classList.add("todo-list");
      const items = [
        "Design an awesome site✅",
        "Go to the grocery store✅",
        "Make the To-Do list actually do something",
        "Tame the right-click menu (and make it customizable)",
        "Convince the browser buttons to behave",
        "Teach the calculator how to use a keyboard",
        "Add more wallpapers (because why not)",
        "Add a videogame (ambitious, maybe)"
      ];

      items.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        list.appendChild(li);
      });

      toDo.appendChild(list);
    }
  }










  //   ---- Create Taskbar Icon ----



  // ---- Flatbar (bottom bar) ----
  const flatbar = document.createElement("div");
  flatbar.classList.add("flatbar");
  flatbar.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  })

  const leftTaskbar = document.createElement("div");
  leftTaskbar.className = "left-taskbar";

  const hmenu = document.createElement("button");
  hmenu.classList.add("hmenu");
  hmenu.id = "left-menu";
  const menuIcon = document.createElement("i");
  menuIcon.className = "fa-solid fa-frog fa-2x";
  hmenu.appendChild(menuIcon);

  hmenu.onmouseenter = () => {
    const menu = document.getElementById(hmenu.id);
    menu.style.boxShadow = "0 0 5px rgba(255,255,255,0.5)";

  }
  hmenu.onmouseleave = () => {
    const menu = document.getElementById(hmenu.id);
    menu.style.boxShadow = "none";
  }

  // Crear display de hmenu

  hmenu.onclick = (e) => {

    if (hMenu == false) {
      displayedMenu = document.createElement("div");
      displayedMenu.classList.add("displayed-menu");
      e.stopPropagation();


      icons.forEach(({ id, text, className }) => {
        const iconHmenu = document.createElement("div");
        iconHmenu.id = "hm" + id + iconHmenu.className;

        Object.assign(iconHmenu.style, {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
          width: displayedMenu.style.width,
          //padding: "5px",
          //margin: "5px",
          marginLeft: "1px",
          transition: "background-color 0.2s ease",
          textAlign: "center",
          borderRadius: "1em",
          flexDirection: "row",
          justifyContent: "start"
        });

        const iconImg = document.createElement("i");
        Object.assign(iconImg.style, {
          //backgroundColor: "black",
          color: "white",
          padding: "10px"
        });

        iconImg.className = className;
        iconHmenu.className = "iconHmenu";


        const iconText = document.createElement("div");
        iconText.className = "hmenu-icon-text";
        iconText.textContent = text;
        iconHmenu.onmouseenter = () => {
          const iconSelected = document.getElementById(iconHmenu.id);
          iconSelected.style.boxShadow = "0 0 5px rgba(255,255,255,0.5)";
        }
        iconHmenu.onmouseleave = () => {
          const iconSelected = document.getElementById(iconHmenu.id);
          iconSelected.style.boxShadow = "none";
        }
        iconHmenu.onclick = () => {
          createWindow(windowIdCounter, text);
          displayedMenu.remove();
          hMenu = false;
        }
        displayedMenu.appendChild(iconHmenu);
        iconHmenu.appendChild(iconImg);
        iconHmenu.appendChild(iconText);
      });


      displayedMenu.addEventListener("click", (e) => e.stopPropagation());
      body.appendChild(displayedMenu);
      hMenu = true;
      return
    }
    displayedMenu.remove();
    hMenu = false;





  }
  // Return to the desktop if user clicks outside of an element
  document.onclick = () => {
    if (hMenu == true) displayedMenu.remove();
    hMenu = false;
  }


  const pinnedPrograms = document.createElement("div");
  pinnedPrograms.className = "pinned-programs";

  const runningPrograms = document.createElement("div");
  runningPrograms.id = "running-programs";
  runningPrograms.className = "running-programs";



  const pinnedIcons = document.createElement("div");
  pinnedIcons.className = "pinned-icons";

  leftTaskbar.appendChild(hmenu);
  leftTaskbar.appendChild(pinnedPrograms);
  leftTaskbar.appendChild(runningPrograms);
  leftTaskbar.appendChild(pinnedIcons);

  const rightTaskBar = document.createElement("div");
  rightTaskBar.style.display = "flex";

  // Clock display

  const clockDate = document.createElement("div");
  clockDate.className = "clock-display";
  clockDate.id = "clock";

  //Show desktop button
  const showDesktop = document.createElement("button");
  showDesktop.classList.add("show-desk-btn");
  showDesktop.id = "showDesk";
  showDesktop.onclick = () => {
    Object.keys(activeWindows).forEach((id) => {
      const aWindow = document.getElementById(id);
      aWindow.style.opacity = "0";
      aWindow.style.pointerEvents = "none";
    });
  }

  /* Falta agregar hover a la hora y que muestre la fecha, en click debería mostrar un calendario*/

  //clockDate.onmouseover ()

  flatbar.appendChild(leftTaskbar);
  flatbar.appendChild(rightTaskBar);
  rightTaskBar.appendChild(clockDate);
  rightTaskBar.appendChild(showDesktop);
  body.appendChild(flatbar);


  // Clock update function

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    const time = hours + ":" + minutes + ":" + seconds;

    document.getElementById("clock").textContent = time;
  }

  setInterval(updateClock, 1000);
  updateClock();



});





