// EDIT THIS NUMBER to your Igenge Fashion Shop WhatsApp number.
// Use country code, no +, spaces or leading 0. Example Burundi: 2577XXXXXXXX
const WHATSAPP_NUMBER = "25766212337";

const products = [
  {id:1,name:"Elegant Dress",price:45000,category:"women",tag:"NEW",image:""},
  {id:2,name:"Classic Top",price:10000,category:"women",tag:"",image:""},
  {id:3,name:"Wide Leg Trousers",price:60000,category:"women",tag:"TRENDING",image:""},
  {id:4,name:"Fashion Jacket",price:25000,category:"women",tag:"NEW",image:""},
  {id:5,name:"Men's Shirt",price:15000,category:"men",tag:"",image:""},
  {id:6,name:"Classic Jeans",price:35000,category:"men",tag:"",image:""}
{id:7,name:"Black Dress",price:20000,category:"women",tag:"NEW",image:"black-dress.jpg"}
];
let cart = JSON.parse(localStorage.getItem("igengeCart") || "[]");

const money = n => new Intl.NumberFormat("en-US").format(n) + " BIF";

function renderProducts(filter="all"){
  const box=document.getElementById("products");
  const list=products.filter(p=>filter==="all" || p.category===filter || (filter==="new" && p.tag==="NEW"));
  box.innerHTML=list.map(p=>`
    <article class="product">
      ${p.tag?`<span class="tag">${p.tag}</span>`:""}
      <div class="product-img">${p.image?`<img src="${p.image}" alt="${p.name}">`:`<span>PRODUCT PHOTO</span>`}</div>
      <h3>${p.name}</h3>
      <div class="price">${money(p.price)}</div>
      <div class="meta">${p.category==="women"?"Women":"Men"} • Available sizes</div>
      <button onclick="addToCart(${p.id})">ADD TO CART</button>
    </article>`).join("");
}
function addToCart(id){
  const p=products.find(x=>x.id===id);
  const found=cart.find(x=>x.id===id);
  if(found) found.qty++; else cart.push({...p,qty:1});
  saveCart(); openCart();
}
function saveCart(){localStorage.setItem("igengeCart",JSON.stringify(cart));updateCart()}
function updateCart(){
  document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
  const items=document.getElementById("cartItems");
  items.innerHTML=cart.length?cart.map(x=>`<div class="cart-item"><div><b>${x.name}</b><br>${money(x.price)} × ${x.qty}</div><button class="remove" onclick="removeItem(${x.id})">Remove</button></div>`).join(""):"<p>Your cart is empty.</p>";
  document.getElementById("cartTotal").textContent=money(cart.reduce((a,x)=>a+x.price*x.qty,0));
}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart()}
function openCart(){document.getElementById("cartPanel").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
function orderWhatsApp(){
  if(!cart.length)return alert("Your cart is empty.");
  const lines=cart.map(x=>`• ${x.name} — ${money(x.price)} × ${x.qty}`).join("\n");
  const total=cart.reduce((a,x)=>a+x.price*x.qty,0);
  const msg=`Hello Igenge Fashion Shop 👋\nI would like to order:\n${lines}\n\nTotal: ${money(total)}\nPlease confirm availability, sizes and delivery.`;
  if(WHATSAPP_NUMBER.includes("X")) return alert("Add your real WhatsApp number in script.js first.");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank");
}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.filter)}));
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;
document.getElementById("orderCart").onclick=orderWhatsApp;
document.getElementById("footerWhatsapp").onclick=e=>{e.preventDefault();window.open(`https://wa.me/${WHATSAPP_NUMBER}`,"_blank")};
renderProducts();updateCart();
