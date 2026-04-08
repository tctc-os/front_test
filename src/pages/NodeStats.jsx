import { useEffect, useState } from 'react';
import { nodeApi } from '../services/api';

const NodeStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        nodeApi.get('/api/stats') // Assure-toi que cette route existe sur ton Node
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur Node:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="p-6 bg-brand-card rounded-xl border border-brand-border">
            <h1 className="text-2xl font-bold text-500 mb-4">Analyse Node</h1>
            {loading ? (
                <p>Chargement des données</p>
            ) : (
                <div className="space-y-4">
                    <p className="text-lg">Voici les données traitées par le backend Node :</p>
                    <div className="p-4 bg-black/10 rounded-lg font-mono">
                        {JSON.stringify(stats, null, 2)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NodeStats;