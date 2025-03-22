function loadfooter(pagedocument) {
  let pages = [
    {
      name: "Home",
      link: "/pages/home/index.html",
    },
    {
      name: "Dashboard",
      link: "/pages/home/cleanerhome.html",
    },
    {
      name: "About",
      link: "",
    },
  ];
  pages = pages.filter(
    (page) => !page.link.endsWith(pagedocument.location.pathname)
  );

  const footer = pagedocument.querySelector("body > footer");
  const footerContent = document.createElement("div");
  footerContent.className = "pt-3 my-4 mx-5";
  footerContent.innerHTML = `
  <ul class="nav justify-content-center border-bottom">
      ${pages
        .map(
          (page) =>
            `<li class="nav-item"><a href="${page.link}" class="nav-link px-2 text-body-secondary">${page.name}</a></li>`
        )
        .join("")}
  </ul>`;
  footer.appendChild(footerContent);
  const copyright = document.createElement("p");
  copyright.className = "text-center text-body-secondary";
  copyright.innerHTML = `© 2025 CleansGuru`;
  footer.appendChild(copyright);
}
