// scrollToTop

const scrollToTopButton = document.getElementById("scrollToTop");
scrollToTopButton.style.display = "none";

window.onscroll = () => {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
};

scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// carousel

$(document).ready(function () {
  $('.carousel').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
  });
});

function discountPercentage(originalPrice, discountPrice) {
  const discountAmount = originalPrice - discountPrice;
  const discountPercentage = (discountAmount / originalPrice) * 100;
  return "&#128293; " + "-" + discountPercentage.toFixed(0) + "%";
}

let priceNames = document.getElementsByClassName("sales-price");

for (let element of priceNames) {
  let originalPrice = element.children.np.innerHTML.slice(0, -1);
  let discountPrice = element.children.dp.innerHTML.slice(0, -1);
  element.children.sp.innerHTML = discountPercentage(originalPrice, discountPrice);
}