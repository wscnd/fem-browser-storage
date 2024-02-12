import API from "./API.js";
import { openDB } from "idb";

const Menu = {
  key: "cm-menu",
  storeName: "categories",
  data: null,
  openDB: async () =>
    await openDB(Menu.key, 1, {
      async upgrade(db) {
        db.createObjectStore(Menu.storeName, {
          keyPath: "name",
        });
      },
    }),
  load: async () => {
    const db = await Menu.openDB();
    try {
      const data = await API.fetchMenu();
      Menu.data = data;
      console.log("Data from the network");
      await db.clear(Menu.storeName);
      data.forEach(async (category) => await db.add(Menu.storeName, category));
    } catch (e) {
      if ((await db.count(Menu.storeName)) > 0) {
        Menu.data = await db.getAll(Menu.storeName);
        console.log("Data from the cache");
      } else {
        console.log("No data is available");
      }
    }
    Menu.render();
  },
  getProductById: async (id) => {
    if (Menu.data == null) {
      await Menu.load();
    }
    for (const c of Menu.data) {
      for (const p of c.products) {
        if (p.id == id) {
          return p;
        }
      }
    }
    return null;
  },
  render: () => {
    let html = "";
    for (const category of Menu.data) {
      html += `
                <li>
                    <h3>${category.name}</h3>
                    <ul class='category'>
                        ${category.products
                          .map(
                            (p) => `
                              <li>
                                <article>
                                  <a
                                    href="#"
                                    onclick="Router.go('/product-${
                                      p.id
                                    }');event.preventDefault()"
                                  >
                                    <img src="/data/images/${p.image}" />
                                    <h4>${p.name}</h4>
                                    <p class="price">$${p.price.toFixed(2)}</p>
                                    <p></p
                                  ></a>
                                </article>
                              </li>
                            `
                          )
                          .join("")}
                    </ul>
                </li>`;
    }
    document.querySelector("#menu").innerHTML = html;
  },
  renderDetails: async (id) => {
    const product = await Menu.getProductById(id);
    if (product == null) {
      console.log(`Product ${id} not found`);
      return;
    }
    document.querySelector("#details article").innerHTML = `
            <header>
                <a href="#" onclick="Router.go('/'); event.preventDefault()">&lt; Back</a>
                <h2>${product.name}</h2>
                <a></a>
            </header>
            <img src="/data/images/${product.image}">
            <p class="description">${product.description}</p>
            <p class="price">$ ${product.price.toFixed(2)} ea</p>
            <button onclick="Order.add(${
              product.id
            }); Router.go('/order')">Add to cart</button>
        `;
  },
};

export default Menu;
