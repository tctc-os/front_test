import { useEffect, useState } from 'react';
import { nodeApi } from '../services/api';

const NodeStats = () => {
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // État pour le formulaire de création
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        status: 'upcoming'
    });

    // 1. CHARGEMENT DES DONNÉES (READ)
    const fetchData = async () => {
        try {
            const [statsRes, eventsRes] = await Promise.all([
                nodeApi.get('/api/stats'),
                nodeApi.get('/api/events')
            ]);
            setStats(statsRes.data);
            setEvents(eventsRes.data);
            setLoading(false);
        } catch (err) {
            console.error("Erreur lors de la récupération:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 2. CRÉATION (CREATE)
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await nodeApi.post('/api/events', formData);
            setFormData({ title: '', description: '', date: '', status: 'upcoming' }); // Reset
            fetchData(); // Rafraîchir la liste et les stats
        } catch (err) {
            alert("Erreur lors de la création");
        }
    };

    // 3. SUPPRESSION (DELETE)
    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cet événement ?")) {
            try {
                await nodeApi.delete(`/api/events/${id}`);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    // 4. MISE À JOUR SIMPLE (UPDATE - Changement de statut)
    const toggleStatus = async (event) => {
        const nextStatus = event.status === 'upcoming' ? 'ongoing' : 'finished';
        try {
            await nodeApi.put(`/api/events/${event.id}`, { status: nextStatus });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-6 text-white">Chargement...</div>;

    return (
        <div className="p-6 space-y-8">
            {/* SECTION STATS (Déjà existante) */}
            <div className="p-6 bg-brand-card rounded-xl border border-brand-border">
                <h1 className="text-2xl font-bold text-white mb-4">Analyse Node.js (Stats)</h1>
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg text-center">
                        <p className="text-xs text-blue-300 uppercase">Total</p>
                        <p className="text-2xl font-bold text-white">{stats?.total || 0}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg text-center">
                        <p className="text-xs text-yellow-300 uppercase">À venir</p>
                        <p className="text-2xl font-bold text-white">{stats?.upcoming || 0}</p>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg text-center">
                        <p className="text-xs text-green-300 uppercase">En cours</p>
                        <p className="text-2xl font-bold text-white">{stats?.ongoing || 0}</p>
                    </div>
                    <div className="p-3 bg-red-500/20 rounded-lg text-center">
                        <p className="text-xs text-red-300 uppercase">Finis</p>
                        <p className="text-2xl font-bold text-white">{stats?.finished || 0}</p>
                    </div>
                </div>
            </div>

            {/* SECTION FORMULAIRE (CREATE) */}
            <div className="p-6 bg-brand-card rounded-xl border border-brand-border">
                <h2 className="text-xl font-bold text-white mb-4">Ajouter un Événement</h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        type="text" placeholder="Titre" required
                        className="bg-black/20 border border-brand-border p-2 rounded text-white"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                    <input 
                        type="date" required
                        className="bg-black/20 border border-brand-border p-2 rounded text-white"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                    <textarea 
                        placeholder="Description"
                        className="bg-black/20 border border-brand-border p-2 rounded text-white md:col-span-2"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded transition md:col-span-2">
                        Créer l'événement via Node
                    </button>
                </form>
            </div>

            {/* SECTION LISTE (READ / UPDATE / DELETE) */}
            <div className="p-6 bg-brand-card rounded-xl border border-brand-border">
                <h2 className="text-xl font-bold text-white mb-4">Liste des Événements</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-white">
                        <thead>
                            <tr className="border-b border-brand-border">
                                <th className="p-2">Titre</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Statut</th>
                                <th className="p-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event.id} className="border-b border-brand-border/50 hover:bg-white/5">
                                    <td className="p-2">{event.title}</td>
                                    <td className="p-2">{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="p-2 text-xs font-mono uppercase text-indigo-300">{event.status}</td>
                                    <td className="p-2 text-right space-x-2">
                                        <button 
                                            onClick={() => toggleStatus(event)}
                                            className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                                        >
                                            Next Step
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(event.id)}
                                            className="text-xs bg-red-900/50 text-red-200 px-2 py-1 rounded hover:bg-red-700"
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

export default NodeStats;