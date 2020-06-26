// отображение меню добавления нового вишлиста
const addWishList = document.querySelector('.add-wishlist');
addWishList?.addEventListener('click', (event) => {
  const add = document.querySelector('.add-new-wishlist');
  add?.classList.toggle('invisible');
});

// удаление вишлиста
document
  .querySelector('#wishlist-main-container')
  ?.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-weshlist')) {
      event.preventDefault();
      const wishId = event.target.id;
      const url = window.location.href
        .toString()
        .split(window.location.host)[1];
      const roomId = url.split('/')[2];
      const response = await fetch(`/rooms/${roomId}/wishlist/${wishId}`, {
        method: 'DELETE',
      });
      if (response.status === 200) {
        const card = event.target.closest('.card');
        card.remove();
      }
    }
  });

// отправка на ручку Cоздание нового вишлиста (Категории)
const sendNewWishlist = document.querySelector('.add-wishlist-button');
sendNewWishlist?.addEventListener('click', async (event) => {
  event.preventDefault();
  const url = window.location.href.toString().split(window.location.host)[1];
  const roomId = url.split('/')[2];
  const wName = document.querySelector('.new-wishlist-input');
  const response = await fetch(`/rooms/${roomId}/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: wName.value }),
  });
  const result = await response.json();
  window.location.reload();
});

// отображение формы добавления нового элемента списка
const wishlist = document.querySelector('.wishlist');
wishlist?.addEventListener('click', async (event) => {
  if (event.target.classList.contains('add-product')) {
    const addForm = document.querySelector('.add-one-product');
    addForm?.classList.toggle('invisible');
  }
  // подкрашиваем зеленым если продукт куплен
  if (event.target.classList.contains('checkbox')) {
    event.target.parentElement.children[1].classList.toggle('bg-success');
    const url = window.location.href.toString().split(window.location.host)[1];
    const roomId = url.split('/')[2];
    const wishlistId = url.split('/')[4].replace('#', '');
    const listId = event.target.parentElement.id;
    const price = document
      .querySelector(`span[id="${listId}"]`)
      .innerText.slice(0, -2);
    const name = event.target.parentElement.firstElementChild.innerText;
    const checkboxValue = event.target.checked;
    const response = await fetch(`/rooms/${roomId}/wishlist/${wishlistId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wishlistItem: listId,
        isbuy: checkboxValue,
        title: name,
        cost: price,
      }),
    });
    const result = await response.json();
  }
  // удаление элемента из списка
  if (event.target.classList.contains('delete-item')) {
    const url = window.location.href.toString().split(window.location.host)[1];
    const roomId = url.split('/')[2];
    const wishlistId = url.split('/')[4].replace('#', '');
    const listId = event.target.parentElement.id;
    const response = await fetch(`/rooms/${roomId}/wishlist/${wishlistId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wishlistItem: listId }),
    });
    const result = await response.json();
    console.log(result);
    event.target.parentElement.remove();
  }
});

// добавляем новый элемент в список вишлиста
const addForm = document.querySelector('.add-one-product');
addForm?.addEventListener('click', async (event) => {
  if (event.target.classList.contains('add-row-button')) {
    event.preventDefault();
    // вытащить данные из двух инпутов
    const name = document.querySelector('.add-input-name').value;
    const price = document.querySelector('.add-input-price').value;
    const isBuy = document.querySelector('.add-input-isbuy').checked;
    // TODO: запись в БД и перезагрузка страницы
    const url = window.location.href.toString().split(window.location.host)[1];
    const roomId = url.split('/')[2];
    const wishlistId = url.split('/')[4].replace('#', '');
    console.log(roomId, wishlistId);
    const response = await fetch(`/rooms/${roomId}/wishlist/${wishlistId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemname: name,
        itemprice: price,
        itemisbuy: isBuy,
      }),
    });
    const result = await response.json();
    window.location.reload();
  }
});
