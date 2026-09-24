const WHATSAPP_NUMBER = "25766212337";

const products = [
  {id:1,name:"Elegant Dress",price:45000,category:"women",tag:"NEW",image:"",images:[]},
  {id:2,name:"Classic Top",price:10000,category:"women",tag:"",image:"",images:[]},
  {id:3,name:"Wide Leg Trousers",price:60000,category:"women",tag:"TRENDING",image:"",images:[]},
  {id:4,name:"Women's Dress",price:25000,category:"women",tag:"NEW",image:"",images:[]},
  {id:5,name:"Men's Shirt",price:15000,category:"men",tag:"",image:"",images:[]},
  {id:6,name:"Classic Jeans",price:35000,category:"men",tag:"",image:"",images:[]},
  {id:7,name:"Black Dress",price:20000,category:"women",tag:"NEW",image:"black-dress.jpg",images:["black-dress.jpg"]}
];

let cart = JSON.parse(localStorage.getItem("igengeCart") || "[]");
const money = n => new Intl.NumberFormat("en-US").format(n) + " BIF";

const style = document.createElement("style");
style.textContent = `
.product-img{cursor:pointer}
.gallery-modal{position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:9999;display:none;align-items:center;justify-content:center;padding:15px}
.gallery-modal.open{display:flex}
.gallery-box{width:min(900px,100%);position:relative;text-align:center}
.gallery-main{width:100%;height:75vh;object-fit:contain}
.gallery-close,.gallery-arrow{position:absolute;border:0;border-radius:50%;background:white;color:black;cursor:pointer;z-index:2}
.gallery-close{right:5px;top:5px;width:42px;height:42px;font-size:22px}
.gallery-arrow{top:50%;width:45px;height:45px;font-size:30px}
.gallery-prev{left:5px}
.gallery-next{right:5px}
.gallery-thumbs{display:flex;gap:8px;overflow:auto;justify-content:center;margin-top:10px}
.gallery-thumb{width:65px;height:75px;object-fit:cover;border:2px solid transparent;cursor:pointer}
.gallery-thumb.active{border-color:white}
`;
document.head.appendChild(style);

const modal = document.createElement("div");
modal.className = "gallery-modal";
modal.innerHTML = `
<div class="gallery-box">
<button class="gallery-close">✕</button>
<img class="gallery-main">
<button class="gallery-arrow gallery-prev">‹</button>
<button class="gallery-arrow gallery-next">›</button>
<div class="gallery-thumbs"></div>
</div>`;
document.body.appendChild(modal);

let galleryImages = [];
let galleryIndex = 0;

function getImages(p){
  if(p.images && p.images.length) return p.images;
  return p.image ? [p.image] : [];
}

function openProductGallery(id){
  const p = products.find(x => x.id === id);
  if(!p) return;
  galleryImages = getImages(p);
  if(!galleryImages.length) return;
  galleryIndex = 0;
  modal.classList.add("open");
  showGalleryImage();
}

function showGalleryImage(){
  modal.querySelector(".gallery-main").src = galleryImages[galleryIndex];

  modal.querySelector(".gallery-thumbs").innerHTML =
    galleryImages.map((img,i) =>
      `<img class="gallery-thumb ${i===galleryIndex?"active":""}"
      src="${img}" onclick="setGalleryImage(${i})">`
    ).join("");

  const arrows = galleryImages.length > 1;
  modal.querySelector(".gallery-prev").style.display = arrows ? "block" : "none";
  modal.querySelector(".gallery-next").style.display = arrows ? "block" : "none";
}

function setGalleryImage(i){
  galleryIndex = i;
  showGalleryImage();
}

function galleryNext(){
  galleryIndex = (galleryIndex + 1) % galleryImages.length;
  showGalleryImage();
}

function galleryPrev(){
  galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
  showGalleryImage();
}

function closeGallery(){
  modal.classList.remove("open");
}

modal.querySelector(".gallery-close").onclick = closeGallery;
modal.querySelector(".gallery-next").onclick = galleryNext;
modal.querySelector(".gallery-prev").onclick = galleryPrev;

modal.onclick = e => {
  if(e.target === modal) closeGallery();
};

document.addEventListener("keydown",e=>{
  if(!modal.classList.contains("open")) return;
  if(e.key==="Escape") closeGallery();
  if(e.key==="ArrowRight") galleryNext();
  if(e.key==="ArrowLeft") galleryPrev();
});

function renderProducts(filter="all"){
  const box = document.getElementById("products");

  const list = products.filter(p =>
    filter==="all" ||
    p.category===filter ||
    (filter==="new" && p.tag==="NEW")
  );

  box.innerHTML = list.map(p => {
    const img = getImages(p)[0];

    return `
    <article class="product">
      ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}

      <div class="product-img"
           onclick="openProductGallery(${p.id})">
        ${img
          ? `<img src="${img}" alt="${p.name}">`
          : `<span>PRODUCT PHOTO</span>`}
      </div>

      <h3>${p.name}</h3>
      <div class="price">${money(p.price)}</div>
      <div class="meta">
        ${p.category==="women"?"Women":"Men"} • Available sizes
      </div>

      <button onclick="addToCart(${p.id})">
        ADD TO CART
      </button>
    </article>`;
  }).join("");
}

function addToCart(id){
  const p = products.find(x => x.id === id);
  const found = cart.find(x => x.id === id);

  if(found) found.qty++;
  else cart.push({...p,qty:1});

  saveCart();
  openCart();
}

function saveCart(){
  localStorage.setItem("igengeCart",JSON.stringify(cart));
  updateCart();
}

function updateCart(){
  const count = document.getElementById("cartCount");
  const items = document.getElementById("cartItems");
  const total = document.getElementById("cartTotal");

  if(count)
    count.textContent = cart.reduce((a,x)=>a+x.qty,0);

  if(items)
    items.innerHTML = cart.length
      ? cart.map(x => `
        <div class="cart-item">
          <div>
            <b>${x.name}</b><br>
            ${money(x.price)} × ${x.qty}
          </div>
          <button onclick="removeItem(${x.id})">
            Remove
          </button>
        </div>
      `).join("")
      : "<p>Your cart is empty.</p>";

  if(total)
    total.textContent =
      money(cart.reduce((a,x)=>a+x.price*x.qty,0));
}

function removeItem(id){
  cart = cart.filter(x => x.id !== id);
  saveCart();
}

function openCart(){
  document.getElementById("cartPanel").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function closeCart(){
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

function orderWhatsApp(){
  if(!cart.length){
    alert("Your cart is empty.");
    return;
  }

  const lines = cart.map(x =>
    `• ${x.name} — ${money(x.price)} × ${x.qty}`
  ).join("\n");

  const total = cart.reduce(
    (a,x)=>a+x.price*x.qty,0
  );

  const msg =
`Hello Igenge Fashion Shop 👋
I would like to order:

${lines}

Total: ${money(total)}

Please confirm availability, sizes and delivery.`;

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

document.querySelectorAll(".filter").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter")
      .forEach(x=>x.classList.remove("active"));

    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

document.getElementById("cartBtn").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
document.getElementById("overlay").onclick = closeCart;
document.getElementById("orderCart").onclick = orderWhatsApp;

document.getElementById("footerWhatsapp").onclick = e=>{
  e.preventDefault();
  window.open(`https://wa.me/${WHATSAPP_NUMBER}`,"_blank");
};

renderProducts();
updateCart();
