const router = require('express').Router();
const Room = require('../models/room.js');
const Wishlist = require('../models/wishlist');
const { v4: uuidv4 } = require('uuid');

const shortUrlMake = () => {
  const arr = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
  ];
  let shortUrl = '';

  for (let i = 0; i < 6; i++) {
    const sUrlIndex = Math.floor(Math.random() * (arr.length - 1) + 1);
    shortUrl += arr[sUrlIndex];
  }

  return shortUrl;
};
// отображение списка комнат
router.get('/', async (req, res) => {
  const rooms = await Room.find();

  rooms.map(
    (room) =>
      (room.createdAt = `${new Date(room.createdAt).getHours()}:${new Date(
        room.createdAt
      ).getMinutes()} 
  ${new Date(room.createdAt).getDate()}.${new Date(
        room.createdAt
      ).getMonth()}.${new Date(room.createdAt).getFullYear()}`)
  );
  res.render('rooms/roomslist', {
    hostName: req.protocol + '://' + req.get('host'),
    rooms,
  });
});

// добавление комнаты
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    const room = new Room({
      title,
      author: req.session.user._id,
    });
    await room.save();
    res.redirect(`/rooms/createlink/${room._id}`);
    // res.redirect(`/rooms/${room._id}`);
  } catch (error) {
    //console.log(error)
    res.redirect('/rooms');
  }
});

router.get('/createlink/:id', async (req, res) => {
  const { id } = req.params;

  const shortUrl = shortUrlMake();

  const room = await Room.findOneAndUpdate(
    { _id: id },
    { $set: { shortUrl } },
    { new: true }
  );

  res.redirect(`/rooms/${room.id}`);
});

// Ручка для удаления комнаты из общего списка (/rooms)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Room.findByIdAndDelete({ _id: id });
    res.status(200).end();
  } catch (error) {
    res.status(400).end();
  }
});

// отображение списка вишлистов конкретной комнаты
router.get('/:id', async (req, res) => {
  const roomId = req.params.id;
  const wishlists = await Wishlist.find({ roomid: roomId });
  try {
    res.render('rooms/room', { wishlists: wishlists, roomid: roomId });
  } catch (error) {
    res.redirect('/rooms');
  }
});

// ручка показа формы всех вишлистов и добавления
router.get('/:id/wishlist', async (req, res) => {
  res.render('rooms/room');
});

// ручка создания нового вишлиста
router.post('/:id/wishlist', async (req, res) => {
  const wishListName = req.body;
  res.json({ result: 'ok' });
  const roomId = req.params.id;
  const wishl = new Wishlist({
    category: wishListName.name,
    roomid: roomId,
  });
  await wishl.save();
  res.json({ wishlistId: 'wishl._id' });
});

// Удаление определённого wishlist

router.delete('/:id/wishlist/:wid', async (req, res) => {
  await Wishlist.findOneAndDelete({ _id: req.params.wid });
  return res.end();
});

// ручка показа конкретного вишлиста комнаты
router.get('/:id/wishlist/:wid', async (req, res) => {
  const { wid } = req.params;
  const wishlist = await Wishlist.findOne({ _id: wid });
  res.render('rooms/wishlist', {
    wishlistTitle: wishlist.category,
    products: wishlist.products,
  });
});

// внесение изменений в список вишлиста
router.patch('/:id/wishlist/:wid', async (req, res) => {
  const wishlistId = req.params.wid;
  const listId = req.body.wishlistItem;
  if (req.body.isbuy === undefined) {
    const result = await Wishlist.update(
      { _id: wishlistId },
      { $pull: { products: { uid: listId } } }
    );
  } else {
     const result = await Wishlist.update(
      { _id: wishlistId },
      {
        $set: {
          products: {
            uid: listId,
            isbuy: req.body.isbuy,
            title: req.body.title,
            cost: req.body.cost,
          },
        },
      }
    );
  }
  res.json({});
});

// добавление нового элемента в список вишлиста
router.put('/:id/wishlist/:wid', async (req, res) => {
  // const roomId = req.params.id;
  const wishlistId = req.params.wid;
  const { itemname, itemprice, itemisbuy } = req.body;
  console.log(itemname, itemprice, itemisbuy);
  const obj = {
    title: itemname,
    cost: itemprice,
    isbuy: itemisbuy,
    uid: uuidv4(),
  };
  const wl = await Wishlist.update(
    { _id: wishlistId },
    { $push: { products: obj } }
  );
  res.json({ wl });
});

// Нужно уточнить куда ведет ручка!!!
router.get('/shortlink/:id', async (req, res) => {
  const shortUrl = req.params.id;
  // const shortUrl = '/rooms/shortlink/' + shortLink;
  const room = await Room.findOne({ shortUrl });
  req.session.url = `/rooms/${room._id}`;
  res.redirect('/rooms/' + room._id);
});

module.exports = router;
