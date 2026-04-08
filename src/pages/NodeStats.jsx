import { useEffect, useState } from 'react';
import { nodeApi } from '../services/api';

const NodeStats = () => {
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // État pour savoir si on est en train d'éditer
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        status: 'upcoming'
    });

    const fetchData = async () => {
        try {
            // Note: Vérifie bien que ton instance nodeApi pointe vers le bon port (ex: 5000)
            const [statsRes, eventsRes] = await Promise.all([
                nodeApi.get('/stats'),
                nodeApi.get('/events')
            ]);
            setStats(statsRes.data);
            setEvents(eventsRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Erreur de connexion au backend Node:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Préparer l'édition : remplit le formulaire avec les infos de l'event
    const startEdit = (event) => {
        setEditingId(event.id);
        setFormData({
            title: event.title,
            description: event.description || '',
            // On coupe la date pour le format <input type="date"> (YYYY-MM-DD)
            date: event.date ? event.date.split('T')[0] : '',
            status: event.status
        });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte au formulaire
    };

    // Annuler l'édition
    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', date: '', status: 'upcoming' });
    };

    // Soumission (Gère POST et PUT)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // UPDATE (PUT)
                await nodeApi.put(`/events/${editingId}`, formData);
            } else {
                // CREATE (POST)
                await nodeApi.post('/events', formData);
            }
            cancelEdit();
            fetchData();
        } catch (err) {
            alert("Erreur lors de l'enregistrement : " + (err.response?.data?.error || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cet événement ?")) {
            try {
                await nodeApi.delete(`/events/${id}`);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return <div className="p-6 text-white text-center">Connexion au serveur Node...</div>;

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-white border-b border-brand-border pb-4">
                Dashboard Technique Node.js
            </h1>

            {/* STATS TILES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total" value={stats?.total} color="blue" />
                <StatCard label="À venir" value={stats?.upcoming} color="yellow" />
                <StatCard label="En cours" value={stats?.ongoing} color="green" />
                <StatCard label="Finis" value={stats?.finished} color="red" />
            </div>

            {/* FORMULAIRE (CREATE & UPDATE) */}
            <div className={`p-6 rounded-xl border transition-all ${editingId ? 'border-indigo-500 bg-indigo-500/5' : 'border-brand-border bg-brand-card'}`}>
                <h2 className="text-xl font-bold text-white mb-4">
                    {editingId ? "📝 Modifier l'événement" : "➕ Nouvel événement (Node)"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text" placeholder="Titre de l'événement" required
                            className="bg-black/40 border border-brand-border p-3 rounded text-white focus:border-indigo-500 outline-none"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                        <input 
                            type="date" required
                            className="bg-black/40 border border-brand-border p-3 rounded text-white focus:border-indigo-500 outline-none"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                    </div>
                    <textarea 
                        placeholder="Description détaillée..."
                        className="w-full bg-black/40 border border-brand-border p-3 rounded text-white h-24 focus:border-indigo-500 outline-none"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                    <div className="flex gap-4">
                        <select 
                            className="bg-black/40 border border-brand-border p-3 rounded text-white outline-none"
                            value={formData.status}
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="upcoming">À venir (upcoming)</option>
                            <option value="ongoing">En cours (ongoing)</option>
                            <option value="finished">Terminé (finished)</option>
                        </select>

                        <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition shadow-lg">
                            {editingId ? "Enregistrer les modifications" : "Créer via Node.js"}
                        </button>

                        {editingId && (
                            <button type="button" onClick={cancelEdit} className="px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                                Annuler
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* LISTE CRUD */}
            <div className="p-6 bg-brand-card rounded-xl border border-brand-border">
                <h2 className="text-xl font-bold text-white mb-4">Gestion des données</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-400 border-b border-brand-border uppercase text-xs">
                                <th className="p-3">Event</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Statut</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-200">
                            {events.map(event => (
                                <tr key={event.id} className="border-b border-brand-border/30 hover:bg-white/5 transition">
                                    <td className="p-3">
                                        <p className="font-bold">{event.title}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-xs">{event.description}</p>
                                    </td>
                                    <td className="p-3">{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            event.status === 'finished' ? 'bg-red-500/20 text-red-400' : 
                                            event.status === 'ongoing' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-right space-x-2">
                                        <button 
                                            onClick={() => startEdit(event)}
                                            className="p-2 bg-indigo-900/30 text-indigo-400 rounded hover:bg-indigo-600 hover:text-white transition"
                                            title="Éditer"
                                        >
                                            Éditer
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(event.id)}
                                            className="p-2 bg-red-900/30 text-red-400 rounded hover:bg-red-600 hover:text-white transition"
                                            title="Supprimer"
                                        >
                                            Suppr.
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Petit composant helper pour les stats
const StatCard = ({ label, value, color }) => (
    <div className={`p-4 bg-${color}-500/10 border border-${color}-500/20 rounded-xl text-center`}>
        <p className={`text-xs text-${color}-400 uppercase font-bold`}>{label}</p>
        <p className="text-3xl font-black text-white">{value || 0}</p>
    </div>
);

export default NodeStats;