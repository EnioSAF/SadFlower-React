export default function handler(req, res) {
    // Vérifiez si le cookie a déjà été défini
    const hasVisitedCookie = req.cookies.hasVisited;

    if (hasVisitedCookie) {
        // Si le cookie existe, renvoyez une réponse indiquant que le cookie est déjà défini
        return res.status(200).json({ message: 'Le cookie a déjà été défini.' });
    }

    // Si le cookie n'existe pas, définissez-le avec une expiration dans le futur
    res.setHeader('Set-Cookie', 'hasVisited=true; Max-Age=31536000; Path=/');

    // Renvoyez une réponse indiquant que le cookie a été réinitialisé avec succès
    return res.status(200).json({ message: 'Cookie réinitialisé avec succès.' });
}