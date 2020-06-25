const router = require('express').Router()
const Room = require('../models/room.js')

const shortUrlMake = () => {
  const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  let shortUrl = '';

  for (let i = 0; i < 6; i++) {
    const sUrlIndex = Math.floor(Math.random() * (arr.length - 1) + 1);
    shortUrl += arr[sUrlIndex];
  }

  return shortUrl;
};

router.get('/', async (req, res) => {
  const rooms = await Room.find();

  rooms.map(room => room.createdAt = `${new Date(room.createdAt).getHours()}:${new Date(room.createdAt).getMinutes()} 
  ${new Date(room.createdAt).getDate()}.${new Date(room.createdAt).getMonth()}.${new Date(room.createdAt).getFullYear()}`)
  res.render('rooms/roomslist', { rooms });
})

router.get('/create', (req, res) => {
  res.render('rooms/roomform');
});

router.post('/create', async (req, res) => {
  try {
    const { title } = req.body;
    const room = new Room({
      title,
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

  const randomLink = shortUrlMake();
  const shortUrl = '/rooms/shortlink/' + randomLink;


  const room = await Room.findOneAndUpdate({ _id: id }, { $set: { shortUrl } }, { new: true });
  res.redirect(`/rooms/${room.id}`);
});

// Ручка для удаления комнаты из общего списка (/rooms)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    console.log(id);

    await Room.findByIdAndDelete({ _id: id })
    res.status(200).end()
  } catch (error) {
    res.status(400).end()
  }
})

// ручка для показа содержимого комнаты (вишлисты комнаты)
router.get('/show', async (req, res) => {
  res.render('rooms/room', { shortUrl: Room.shortUrl });
});



router.get('/:id', async (req, res) => {
  try {
    res.render('rooms/room');
  } catch (error) {
    res.redirect('/rooms');
  }

})


// Нужно уточнить куда ведет ручка!!!
router.get('/shortlink/:id', async (req, res) => {
  const shortLink = req.params.id;
  console.log(shortLink);
  const shortUrl = '/rooms/shortlink/' + shortLink;
  const room = await Room.findOne({ shortUrl });
  // console.log(room._id);

  req.session.link = room.id;
  res.redirect('/rooms/' + room.id);
});

module.exports = router;
