let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
  controller = new ScrollMagic.Controller();

  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");

    const slideTL = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });

    slideTL.fromTo(revealImg, { x: "0%" }, { x: "200%" });

    slideTL.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    slideTL.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-= 0.75");

    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTL)
      .addTo(controller);

    const pageTL = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTL.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTL.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0 });
    pageTL.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTL)
      .addTo(controller);
  });
}

function detailAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");

  slides.forEach((slide, index, slides) => {
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    let nextImg = nextSlide.querySelector("img");
    const slideTL = gsap.timeline({ defaults: { duration: 1 } });
    slideTL.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTL.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
    slideTL.fromTo(nextImg, { x: "50%" }, { x: "0%" });
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTL)
      .addTo(controller);
  });
}

const mouse = document.querySelector(".cursor");
const mouseText = mouse.querySelector("span");
const burger = document.querySelector(".burger");

function curser(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseText.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    gsap.to(".title-swipe", 1, { y: "100%" });
    mouseText.innerText = "";
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45deg", y: "5px", background: "black" });
    gsap.to(".line2", 0.5, {
      rotate: "-45deg",
      y: "-5px",
      background: "black",
    });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%" });
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0deg", y: "0px", background: "white" });
    gsap.to(".line2", 0.5, {
      rotate: "0deg",
      y: "0px",
      background: "white",
    });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%" });
  }
}

const logo = document.querySelector("#logo");

barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();

        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        detailAnimation();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        const done = this.async();
        const TL = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        TL.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        TL.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        const done = this.async();

        window.scrollTo(0, 0);
        const TL = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        TL.fromTo(
          ".swipe",
          0.75,
          { x: "0%" },
          { x: "100%", stagger: 0.25, onComplete: done }
        );
        TL.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
        TL.fromTo(".nav-header", 1, { y: "-100%" }, { y: "0%" }, "-=0.5");
      },
    },
  ],
});

window.addEventListener("mousemove", curser);
window.addEventListener("mouseover", activeCursor);
burger.addEventListener("click", navToggle);
