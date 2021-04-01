const els = {
  figure1: null,
  figure2: null,
  figure3: null,
  figure4: null,

  owner: null,
  expiryDate: null,
};

const init = () => {
  //   const figure1El = document.querySelector('[name="figure-1"]');
  //   figure1El.focus();
  document.querySelector(".figure").addEventListener("keyup", ({ target }) => {
    //   console.log("#1");
    if (!target.matches("input")) {
      // console.log("#2");
      return;
    }

    if (target.value.length === 4) {
      const currentTabIndex = parseInt(target.getAttribute("tabindex"));
      document.querySelector(`[tabindex="${currentTabIndex + 1}"]`).focus();
      const inputs = document.querySelectorAll(".figure input");
      const cardNumber = [].map.call(inputs, (el) => el.value).join("");
      console.log("cardNumber", cardNumber);
      const cardResult = creditCardType(cardNumber);
      console.log("cardResult", cardResult);
      if (cardResult.length) {
        const cardType = cardResult[0].niceType;
        document.querySelector(".bank p").textContent = cardType;
      }
    }
    //   console.log("target", target);
    //   console.log("target.value", target.value);
    //   console.log("target.getAttr", target.getAttribute("tabindex"));
  });
  document
    .querySelector('[name="month"]')
    .addEventListener("change", ({ target }) => {
      target.nextElementSibling.focus();
    });
};

window.addEventListener("load", init);
