import React from 'react';

export const LegendView: React.FC = () => {
    const codes = [
        { c: 'CM', l: 'Café da Manhã', color: 'bg-orange-400' }, { c: 'LM', l: 'Lanche da Manhã', color: 'bg-yellow-400' },
        { c: 'A', l: 'Almoço', color: 'bg-green-500' }, { c: 'LT', l: 'Lanche da Tarde', color: 'bg-teal-400' },
        { c: 'J', l: 'Jantar', color: 'bg-blue-500' }, { c: 'S', l: 'Sobremesa', color: 'bg-pink-500' },
        { c: 'AC', l: 'Acompanhamento', color: 'bg-purple-500' }, { c: 'B', l: 'Base', color: 'bg-gray-500' }
    ];
    return (
        <div className="flex-1 flex flex-col py-10 items-center justify-center bg-white font-sans">
            <h1 className="font-playfair text-4xl font-bold text-navy uppercase tracking-widest mb-16">Legendas</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-8">
                {codes.map(i => (
                <div key={i.c} className="flex items-center gap-4 bg-surface p-4 rounded-2xl border border-white shadow-soft">
                    <span className={`${i.color} text-white font-black text-xs w-10 h-10 flex items-center justify-center rounded-xl shadow-md shrink-0`}>{i.c}</span>
                    <span className="text-navy font-bold text-sm uppercase tracking-widest">{i.l}</span>
                </div>
                ))}
            </div>
        </div>
    );
};