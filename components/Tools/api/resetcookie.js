export default function handler(req, res) {
    const { authorization } = req.headers;
    const secret = process.env.RESET_COOKIE_SECRET;

    if (authorization === `Bearer ${secret}`) {
        // Logique pour réinitialiser le cookie ici
        res.status(200).json({ message: 'Cookie réinitialisé avec succès.' });
    } else {
        res.status(401).json({ message: 'Non autorisé.' });
    }
}