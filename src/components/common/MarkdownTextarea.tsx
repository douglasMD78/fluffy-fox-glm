import React, { useRef } from 'react';
import { Type } from '@/components/icons'; // Usando o ícone Type para negrito

interface MarkdownTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    className?: string;
    label?: string;
    accentColor?: string;
}

export const MarkdownTextarea: React.FC<MarkdownTextareaProps> = ({
    value,
    onChange,
    placeholder,
    rows = 5,
    className = "",
    label,
    accentColor = "accent"
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const applyBold = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        let newValue;
        if (selectedText.startsWith('**') && selectedText.endsWith('**')) {
            // Remove bold if already applied
            newValue = value.substring(0, start) + selectedText.slice(2, -2) + value.substring(end);
        } else {
            // Apply bold
            newValue = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
        }
        
        onChange(newValue);

        // Restore selection or set cursor after bolded text
        setTimeout(() => {
            if (textarea) {
                if (selectedText) {
                    textarea.setSelectionRange(start + 2, end + 2);
                } else {
                    textarea.focus();
                }
            }
        }, 0);
    };

    return (
        <div className="relative">
            {label && <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">{label}</label>}
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    className={`w-full bg-white border border-gray-200 p-4 rounded-xl text-xs leading-relaxed text-navy focus:border-${accentColor} outline-none shadow-sm pr-10 ${className}`}
                    rows={rows}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={applyBold}
                    className={`absolute top-2 right-2 p-1 rounded-md bg-gray-50 text-navy/60 hover:bg-gray-100 transition-colors`}
                    title="Negrito (Markdown)"
                >
                    <Type size={14} className="font-bold" />
                </button>
            </div>
        </div>
    );
};