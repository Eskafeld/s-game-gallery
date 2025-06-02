export default function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400).send('Missing game id');
    return;
  }

  const steamUrl = `https://store.steampowered.com/app/${id}/`;

  res.writeHead(302, { Location: steamUrl });
  res.end();
}
