import React, { SetStateAction } from 'react'
import { motion } from "framer-motion"
import { HiOutlineTrash } from 'react-icons/hi'
import Button from './ui/Button'
import { useTranslations } from 'next-intl'

const Modles = ({
    setShowDeleteModal,
    selectedItem,
    handleDeleteItem,
    title,
    description,
    buttonText
}: {
    setShowDeleteModal: React.Dispatch<SetStateAction<boolean>>,
    selectedItem: { name: string },
    handleDeleteItem: () => void,
    title?: string,
    description?: string,
    buttonText?: string
}) => {
    const t = useTranslations("Common.Modals.delete");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteModal(false)}
                className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md"
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-4xl p-10 shadow-2xl overflow-hidden text-center"
            >
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                    <HiOutlineTrash className="text-4xl text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">{title || t("title")}</h2>
                <p className="text-zinc-500 text-sm mb-10 font-medium">
                    {description || t.rich("description", {
                        name: selectedItem?.name,
                        bold: (chunks) => <span className="text-white font-bold">{chunks}</span>
                    })}
                </p>

                <div className="flex gap-4">
                    <Button
                        onClick={handleDeleteItem}
                        className="flex-1 py-4 text-sm font-black bg-red-600 hover:bg-red-500"
                    >
                        {buttonText || t("confirm")}
                    </Button>
                    <Button
                        onClick={() => setShowDeleteModal(false)}
                        className="flex-1 py-4 text-sm font-black bg-zinc-800 hover:bg-zinc-700 text-white"
                    >
                        {t("cancel")}
                    </Button>
                </div>
            </motion.div>
        </div>)
}

export default Modles