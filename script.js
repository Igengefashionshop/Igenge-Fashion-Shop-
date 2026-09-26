// Igenge Fashion Shop
// WhatsApp: +257 66212337

const WHATSAPP_NUMBER = "25766212337";

const SUPABASE_URL = "https://otdycenfglcoedykqztp.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_91PSUTmPq2DqvPchqj54Ew_tCz6iP1I";

const products = [
  {
    id: 1,
    name: "Elegant Dress",
    price: 45000,
    category: "women",
    tag: "NEW",
    image: "PXL_20260922_170820264.jpg",
    images: [],
    sizes: ["M", "L"]
  },

  {
    id: 2,
    name: "Classic Top",
    price: 10000,
    category: "women",
    tag: "",
    image: "",
    images: [],
    sizes: ["S", "M", "L"]
  },

  {
    id: 3,
    name: "Wide Leg Trousers",
    price: 60000,
    category: "women",
    tag: "TRENDING",
    image: "",
    images: [],
    sizes: ["M", "L", "XL"]
  },

  {
    id: 4,
    name: "Women's Dress",
    price: 25000,
    category: "women",
    tag: "NEW",
    image: "",
    images: [],
    sizes: ["L"]
  },

  {
    id: 5,
    name: "Men's Shirt",
    price: 15000,
    category: "men",
    tag: "",
    image: "",
    images: [],
    sizes: ["M", "L", "XL"]
  },

  {
    id: 6,
    name: "Classic Jeans",
    price: 35000,
    category: "men",
    tag: "",
    image: "",
    images: [],
    sizes: ["32", "34", "36"]
  },

  {
    id: 7,
    name: "Black Dress",
    price: 20000,
    category: "women",
    tag: "NEW",
    image: "black-dress.jpg",
    images: ["black-dress.jpg"],
    sizes: ["XL", "L"]
  }

  // KUONGEZA BIDHAA MPYA:
  // Copy product moja hapo juu, iweke chini yake,
  // kisha badilisha id, name, price, image na sizes.
];

let cart = JSON.parse(localStorage.getItem("igengeCart") || "[]");

const money = n =>
  new Intl.NumberFormat("en-US").format(Number(n) || 0) + " BIF";


function getImages(product) {
  if (product.images && product.images.length) {
    return product.images;
  }

  if (product.image) {
    return [product.image];
  }

  return [];
}


function productUrl(product) {
  const url = new URL(window.location.href);

  url.search = "";
  url.hash = "";

  url.searchParams.set("product", product.id);

  return url.href;
}


function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function sizesText(product) {
  if (!product.sizes || !product.sizes.length) {
    return "Free Size";
  }

  return product.sizes.join(" • ");
}


function sizeOptions(product) {
  if (!product.sizes || !product.sizes.length) {
    return `<option value="">Free Size</option>`;
  }

  return product.sizes
    .map(size => `
      <option value="${escapeHtml(size)}">
        ${escapeHtml(size)}
      </option>
    `)
    .join("");
}


function renderProducts(filter = "all") {

  const box = document.getElementById("products");

  if (!box) return;

  const list = products.filter(product => {

    return (
      filter === "all" ||
      product.category === filter ||
      (filter === "new" && product.tag === "NEW")
    );

  });


  if (!list.length) {

    box.innerHTML = `
      <p class="empty-products">
        No products available in this section.
      </p>
    `;

    return;
  }


  box.innerHTML = list.map(product => {

    const images = getImages(product);

    const mainImage =
      images[0] ||
      product.image ||
      "";


    return `

      <article
        class="product"
        id="product-${product.id}"
      >

        ${
          product.tag
            ? `<span class="tag">${escapeHtml(product.tag)}</span>`
            : ""
        }


        <div
          class="product-img gallery-trigger"
          role="button"
          tabindex="0"
          onclick="openProductGallery(${product.id})"
          onkeydown="
            if(event.key==='Enter'||event.key===' ')
            openProductGallery(${product.id})
          "
        >

          ${
            mainImage
              ? `
                <img
                  src="${escapeHtml(mainImage)}"
                  alt="${escapeHtml(product.name)}"
                  loading="lazy"
                >
              `
              : `
                <span>PRODUCT PHOTO</span>
              `
          }

        </div>


        <h3>
          ${escapeHtml(product.name)}
        </h3>


        <div class="price">
          ${money(product.price)}
        </div>


        <div class="meta">

          ${
            product.category === "women"
              ? "Women"
              : "Men"
          }

        </div>


        <div class="available-sizes">

          <strong>
            Available Size${
              product.sizes &&
              product.sizes.length > 1
                ? "s"
                : ""
            }:
          </strong>

          ${escapeHtml(sizesText(product))}

        </div>


        <label
          class="size-label"
          for="size-${product.id}"
        >
          Choose size
        </label>


        <select
          class="size-select"
          id="size-${product.id}"
        >

          ${sizeOptions(product)}

        </select>


        <button
          onclick="addToCart(${product.id})"
        >
          ADD TO CART
        </button>

      </article>

    `;

  }).join("");
}



function addToCart(id) {

  const product =
    products.find(x => x.id === id);

  if (!product) return;


  const select =
    document.getElementById(`size-${id}`);


  const selectedSize =
    select ? select.value : "";


  const found = cart.find(x =>

    x.id === id &&
    (x.selectedSize || "") === selectedSize

  );


  if (found) {

    found.qty++;

  } else {

    cart.push({

      ...product,

      selectedSize,

      qty: 1

    });

  }


  saveCart();

  openCart();
}



function saveCart() {

  localStorage.setItem(
    "igengeCart",
    JSON.stringify(cart)
  );

  updateCart();
}



function updateCart() {

  const count =
    document.getElementById("cartCount");


  const items =
    document.getElementById("cartItems");


  const totalBox =
    document.getElementById("cartTotal");


  if (count) {

    count.textContent =
      cart.reduce(
        (total, item) =>
          total + item.qty,
        0
      );

  }


  if (items) {

    if (!cart.length) {

      items.innerHTML =
        "<p>Your cart is empty.</p>";

    } else {

      items.innerHTML =
        cart.map((item, index) => `

          <div class="cart-item">

            <div>

              <b>
                ${escapeHtml(item.name)}
              </b>

              <br>

              ${money(item.price)}
              × ${item.qty}

              <br>

              <small>
                Size:
                ${escapeHtml(
                  item.selectedSize ||
                  "Free Size"
                )}
              </small>

            </div>


            <button
              class="remove"
              onclick="removeItem(${index})"
            >
              Remove
            </button>

          </div>

        `).join("");

    }

  }


  if (totalBox) {

    totalBox.textContent =
      money(
        cart.reduce(
          (total, item) =>
            total +
            item.price * item.qty,
          0
        )
      );

  }

}



function removeItem(index) {

  cart.splice(index, 1);

  saveCart();

}



function openCart() {

  document
    .getElementById("cartPanel")
    ?.classList.add("open");


  document
    .getElementById("overlay")
    ?.classList.add("show");

}



function closeCart() {

  document
    .getElementById("cartPanel")
    ?.classList.remove("open");


  document
    .getElementById("overlay")
    ?.classList.remove("show");

}


/* =========================
   PRODUCT GALLERY
========================= */

let currentGalleryProductId = null;

let currentGalleryIndex = 0;



function ensureGallery() {

  if (
    document.getElementById(
      "productGalleryModal"
    )
  ) return;


  const style =
    document.createElement("style");


  style.textContent = `

    .product-img.gallery-trigger {
      cursor: pointer;
    }


    .product-gallery-modal {

      position: fixed;

      inset: 0;

      background: rgba(0,0,0,.88);

      z-index: 9999;

      display: none;

      align-items: center;

      justify-content: center;

      padding: 20px;

    }


    .product-gallery-modal.show {
      display: flex;
    }


    .gallery-box {

      width: min(100%, 900px);

      max-height: 95vh;

      position: relative;

      display: flex;

      flex-direction: column;

      align-items: center;

    }


    .gallery-main {

      width: 100%;

      height: min(70vh,650px);

      display: flex;

      align-items: center;

      justify-content: center;

    }


    .gallery-main img {

      max-width: 100%;

      max-height: 100%;

      object-fit: contain;

      border-radius: 8px;

    }


    .gallery-title {

      color: #fff;

      font-size: 20px;

      font-weight: 700;

      margin: 10px 0 4px;

      text-align: center;

    }


    .gallery-price {

      color: #fff;

      margin-bottom: 10px;

    }


    .gallery-close,
    .gallery-arrow {

      position: absolute;

      border: 0;

      cursor: pointer;

      background: #fff;

      color: #111;

      border-radius: 50%;

      width: 42px;

      height: 42px;

      font-size: 25px;

      z-index: 2;

    }


    .gallery-close {

      right: 0;

      top: 0;

    }


    .gallery-arrow.prev {

      left: 10px;

      top: 50%;

      transform: translateY(-50%);

    }


    .gallery-arrow.next {

      right: 10px;

      top: 50%;

      transform: translateY(-50%);

    }


    .gallery-thumbs {

      display: flex;

      gap: 8px;

      overflow-x: auto;

      max-width: 100%;

      padding: 10px 0;

    }


    .gallery-thumbs img {

      width: 70px;

      height: 70px;

      object-fit: cover;

      border-radius: 6px;

      cursor: pointer;

      border: 2px solid transparent;

    }


    .gallery-thumbs img.active {

      border-color: #fff;

    }


    .gallery-link {

      color: #fff;

      font-size: 13px;

      opacity: .8;

      max-width: 100%;

      overflow: hidden;

      text-overflow: ellipsis;

      white-space: nowrap;

    }


    .available-sizes {

      font-size: 13px;

      margin: 7px 0;

      color: #555;

    }


    .size-label {

      display: block;

      font-size: 12px;

      margin: 7px 0 4px;

      font-weight: 600;

    }


    .size-select {

      width: 100%;

      padding: 9px;

      border: 1px solid #ddd;

      border-radius: 6px;

      background: #fff;

    }

  `;


  document.head.appendChild(style);


  const modal =
    document.createElement("div");


  modal.id =
    "productGalleryModal";


  modal.className =
    "product-gallery-modal";


  modal.innerHTML = `

    <div class="gallery-box">

      <button
        class="gallery-close"
        onclick="closeProductGallery()"
      >
        ×
      </button>


      <div class="gallery-main">

        <button
          class="gallery-arrow prev"
          onclick="galleryPrev()"
        >
          ‹
        </button>


        <img
          id="galleryMainImage"
          src=""
          alt=""
        >


        <button
          class="gallery-arrow next"
          onclick="galleryNext()"
        >
          ›
        </button>

      </div>


      <div
        id="galleryTitle"
        class="gallery-title"
      ></div>


      <div
        id="galleryPrice"
        class="gallery-price"
      ></div>


      <div
        id="galleryThumbs"
        class="gallery-thumbs"
      ></div>


      <div
        id="galleryLink"
        class="gallery-link"
      ></div>

    </div>

  `;


  modal.addEventListener(
    "click",
    event => {

      if (event.target === modal) {

        closeProductGallery();

      }

    }
  );


  document.body.appendChild(modal);

}



function openProductGallery(id) {

  ensureGallery();


  const product =
    products.find(x => x.id === id);


  if (!product) return;


  const images =
    getImages(product);


  if (!images.length) {

    document
      .getElementById(
        `product-${id}`
      )
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    return;

  }


  currentGalleryProductId = id;

  currentGalleryIndex = 0;


  renderGallery();


  document
    .getElementById(
      "productGalleryModal"
    )
    .classList.add("show");


  document.body.style.overflow =
    "hidden";

}



function renderGallery() {

  const product =
    products.find(
      x => x.id ===
        currentGalleryProductId
    );


  if (!product) return;


  const images =
    getImages(product);


  const main =
    images[currentGalleryIndex] ||
    images[0];


  document
    .getElementById(
      "galleryMainImage"
    )
    .src = main;


  document
    .getElementById(
      "galleryMainImage"
    )
    .alt = product.name;


  document
    .getElementById(
      "galleryTitle"
    )
    .textContent =
      product.name;


  document
    .getElementById(
      "galleryPrice"
    )
    .textContent =
      money(product.price);


  document
    .getElementById(
      "galleryLink"
    )
    .textContent =
      productUrl(product);


  document
    .getElementById(
      "galleryThumbs"
    )
    .innerHTML =

      images.map(
        (image, index) => `

          <img
            src="${escapeHtml(image)}"
            class="${
              index === currentGalleryIndex
                ? "active"
                : ""
            }"
            onclick="galleryGo(${index})"
            alt="${escapeHtml(product.name)}"
          >

        `
      ).join("");

}



function galleryGo(index) {

  const product =
    products.find(
      x => x.id ===
        currentGalleryProductId
    );


  if (!product) return;


  const images =
    getImages(product);


  if (!images.length) return;


  currentGalleryIndex =
    Math.max(
      0,
      Math.min(
        index,
        images.length - 1
      )
    );


  renderGallery();

}



function galleryPrev() {

  const product =
    products.find(
      x => x.id ===
        currentGalleryProductId
    );


  if (!product) return;


  const images =
    getImages(product);


  currentGalleryIndex =
    (
      currentGalleryIndex -
      1 +
      images.length
    ) %
    images.length;


  renderGallery();

}



function galleryNext() {

  const product =
    products.find(
      x => x.id ===
        currentGalleryProductId
    );


  if (!product) return;


  const images =
    getImages(product);


  currentGalleryIndex =
    (
      currentGalleryIndex +
      1
    ) %
    images.length;


  renderGallery();

}



function closeProductGallery() {

  const modal =
    document.getElementById(
      "productGalleryModal"
    );


  if (modal) {

    modal.classList.remove("show");

  }


  document.body.style.overflow =
    "";

}



document.addEventListener(
  "keydown",
  event => {

    const modal =
      document.getElementById(
        "productGalleryModal"
      );


    if (
      !modal?.classList.contains(
        "show"
      )
    ) return;


    if (event.key === "Escape") {

      closeProductGallery();

    }


    if (event.key === "ArrowLeft") {

      galleryPrev();

    }


    if (event.key === "ArrowRight") {

      galleryNext();

    }

  }
);


/* =========================
   WHATSAPP ORDER
========================= */

function orderWhatsApp() {

  if (!cart.length) {

    alert("Your cart is empty.");

    return;

  }


  const lines =
    cart.map(item => {

      const product =
        products.find(
          x => x.id === item.id
        ) || item;


      const link =
        productUrl(product);


      return `• ${item.name} — ${money(item.price)} × ${item.qty}
  Size: ${item.selectedSize || "Free Size"}
  🖼️ Product: ${link}`;

    }).join("\n\n");


  const total =
    cart.reduce(
      (total, item) =>
        total +
        item.price *
        item.qty,
      0
    );


  const message =

`Hello Igenge Fashion Shop 👋

I would like to order:

${lines}

Total: ${money(total)}

Please confirm availability, size and delivery.`;


  window.open(

    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,

    "_blank"

  );

}


/* =========================
   PAGE EVENTS
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    ensureGallery();


    document
      .querySelectorAll(".filter")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".filter"
              )
              .forEach(x =>
                x.classList.remove(
                  "active"
                )
              );


            button.classList.add(
              "active"
            );


            renderProducts(
              button.dataset.filter
            );

          }
        );

      });


    document
      .getElementById("cartBtn")
      ?.addEventListener(
        "click",
        openCart
      );


    document
      .getElementById("closeCart")
      ?.addEventListener(
        "click",
        closeCart
      );


    document
      .getElementById("overlay")
      ?.addEventListener(
        "click",
        closeCart
      );


    document
      .getElementById("orderCart")
      ?.addEventListener(
        "click",
        orderWhatsApp
      );


    document
      .getElementById(
        "footerWhatsapp"
      )
      ?.addEventListener(
        "click",
        event => {

          event.preventDefault();

          window.open(
            `https://wa.me/${WHATSAPP_NUMBER}`,
            "_blank"
          );

        }
      );


    renderProducts();

    updateCart();


    const productId =
      Number(
        new URLSearchParams(
          window.location.search
        ).get("product")
      );


    if (productId) {

      setTimeout(() => {

        const product =
          products.find(
            p => p.id === productId
          );


        if (product) {

          openProductGallery(
            productId
          );

        }

      }, 400);

    }

  }
);
