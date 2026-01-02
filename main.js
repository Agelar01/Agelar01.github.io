
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
    { id: "game", text: "Game", className: "fa-solid fa-gamepad fa" },
    { id: "about-me", text: "About me", className: "fa-solid fa-id-card fa" },
    { id: "terminal", text: "Terminal", className: "fa-solid fa-terminal fa" },
    { id: "calculator", text: "Maths", className: "fa-solid fa-calculator fa" },
    { id: "browser", text: "Browser", className: "fa-solid fa-globe fa" }
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

      navBtns.forEach(({ id, className }) => {
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
          let input = adressBar.value.trim();

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
          } else {
            const searchQuery = encodeURIComponent(input);
            webContent.src = `https://www.google.com/search?q=${searchQuery}`;
          }
        }
      });


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
      goBtnContainer.appendChild(goBtn);
      searchBar.appendChild(goBtnContainer);

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
        if (inputExists == false) createInput();
        else {
          const input = document.getElementById(inputPointer);
          input.remove();
          createInput();
        }


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
          fontSize: "inherit"

        });


        // Listening to commands or printing text
        input.id = "input" + windowDiv.id;
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            const comando = event.target.value.trim();
            event.target.value = "";

            switch (comando) {
              case "game":
                createWindow(windowIdCounter, "Game");
                refresh();
                break;

              case "clear":
                if (paragraphList.length > 0) {
                  paragraphList.forEach(line => {
                    const toDelete = document.getElementById(line);
                    paraOnScreen = [];
                    paragraphList.pop(line);
                    toDelete.remove();
                  });
                }
                break;

              case "help":
                createParagraph("List of commands: game, clear, help");
                refresh();
                break;

              default:
                createParagraph(`user@FrogOs:~$${comando}`);
                refresh();
            }
          }
        });
        inputContainer.appendChild(input);
      }

      function refresh() {
        list = paragraphList;
        if (list.length > 0) {
          list.forEach(line => {
            const toDelete = document.getElementById(line);
            toDelete.remove();
          });
          paragraphList = [];
        }
        onScreen = paraOnScreen;
        onScreen.forEach(line => {
          createParagraph(line);
        });
        paraOnScreen = onScreen;
      }
      createParagraph("Type 'help' for a list of commands");
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





