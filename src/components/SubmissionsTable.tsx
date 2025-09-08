import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SubmissionsTable() {
    const [submissions, setSubmissions] = useState<any[]>([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            const { data } = await supabase
                .from("submissions")
                .select("*")
                .order("created_at", { ascending: false });
            setSubmissions(data || []);
        };
        fetchSubmissions();
    }, []);
    return (
        <div className="w-full bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Utilisateur</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Message</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                </tr>
                </thead>
                <tbody>
                {submissions.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition">
                        <td className="px-3 py-2 break-all">{sub.user_id}</td>
                        <td className="px-3 py-2">{sub.message}</td>
                        <td className="px-3 py-2">{new Date(sub.created_at).toLocaleDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
