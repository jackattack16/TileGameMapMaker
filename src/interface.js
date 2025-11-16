
document.addEventListener("DOMContentLoaded", () => {
  // Collapse Buttons
  {
    let collapseButtons = document.getElementsByClassName("collapse-button");

    for(let i = 0; i < collapseButtons.length; i++) {
      collapseButtons[i].addEventListener("click", function() {
        let span = this.children[0];
        if (span.style.transform === "") {
          span.style.transform = " rotateX(180deg)";
        } else {
          span.style.transform = "";
        }
        
        let topBar = this.parentElement;
        let content = topBar.nextElementSibling;
        content.classList.toggle("uncollapsed");
      });
    }
  }

  // Sidebar Selector buttons
  {
    let sideBarSelectors = document.getElementsByClassName("left-sidebar-selector-item");

    for(let i = 0; i < sideBarSelectors.length; i++) {
      sideBarSelectors[i].addEventListener("click", function() {
        if (!this.classList.contains("selected")) {
          for(let x = 0; x < sideBarSelectors.length; x++) { sideBarSelectors[x].classList.remove("selected") }
          this.classList.add("selected");

          let sideBar = this.parentElement;
          const panels = sideBar.nextElementSibling.querySelectorAll(".left-sidebar-pannel-container");
          panels.forEach((panel, idx) => {
            panel.classList.toggle("hidden", idx !== i);
          });
        }  
      });
    }
  }
});