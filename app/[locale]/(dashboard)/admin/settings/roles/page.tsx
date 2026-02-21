"use client";

import React from "react";
import { motion } from "framer-motion";
import { HiShieldCheck, HiOutlineLockClosed, HiBadgeCheck } from "react-icons/hi";
import { useTranslations } from "next-intl";

const RolesPage = () => {
    const t = useTranslations("D.admin.roles");

    const roles = [
        {
            id: "ADMIN",
            name: t("roles.ADMIN.name"),
            description: t("roles.ADMIN.description"),
            color: "text-red-400",
            bg: "bg-red-500/10",
        },
        {
            id: "OWNER",
            name: t("roles.OWNER.name"),
            description: t("roles.OWNER.description"),
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
        },
        {
            id: "STAFF",
            name: t("roles.STAFF.name"),
            description: t("roles.STAFF.description"),
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
        },
        {
            id: "USER",
            name: t("roles.USER.name"),
            description: t("roles.USER.description"),
            color: "text-zinc-400",
            bg: "bg-zinc-500/10",
        }
    ];

    const permissionGroups = [
        {
            title: t("groups.system"),
            permissions: [
                { id: "PLATFORM_SETTINGS", roles: ["ADMIN"] },
                { id: "USER_MANAGEMENT", roles: ["ADMIN"] },
                { id: "BUSINESS_APPROVAL", roles: ["ADMIN"] }
            ]
        },
        {
            title: t("groups.business"),
            permissions: [
                { id: "MANAGE_BUSINESS", roles: ["ADMIN", "OWNER"] },
                { id: "MANAGE_SERVICES", roles: ["ADMIN", "OWNER"] },
                { id: "VIEW_ANALYTICS", roles: ["ADMIN", "OWNER"] }
            ]
        },
        {
            title: t("groups.operations"),
            permissions: [
                { id: "MANAGE_APPOINTMENTS", roles: ["ADMIN", "OWNER", "STAFF"] },
                { id: "VIEW_CUSTOMERS", roles: ["ADMIN", "OWNER", "STAFF"] },
                { id: "CREATE_BOOKINGS", roles: ["ADMIN", "OWNER", "STAFF", "USER"] }
            ]
        }
    ];

    return (
        <div className="p-8 space-y-10"> {/* Removed dir="rtl" */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <HiShieldCheck className="text-indigo-500" />
                    {t("title")}
                </h1>
                <p className="text-zinc-500">{t("subtitle")}</p>
            </div>

            {/* Roles Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {roles.map((role) => (
                    <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col gap-4"
                    >
                        <div className={`w-12 h-12 rounded-2xl ${role.bg} ${role.color} flex items-center justify-center text-2xl`}>
                            <HiBadgeCheck />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{role.name}</h3>
                            <p className="text-zinc-500 text-sm leading-relaxed">{role.description}</p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-zinc-800/50">
                            <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">{role.id}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Permissions Matrix */}
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-zinc-800 bg-zinc-900/50">
                    <h2 className="text-xl font-black text-white">{t("matrix.title")}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-start border-collapse">
                        <thead>
                            <tr className="bg-black/20">
                                <th className="p-6 text-zinc-400 font-bold border-b border-zinc-800 text-start">{t("matrix.permission")}</th>
                                {roles.map(role => (
                                    <th key={role.id} className="p-6 text-white font-black text-center border-b border-zinc-800 border-x border-zinc-800/20">
                                        {role.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {permissionGroups.map((group, gIndex) => (
                                <React.Fragment key={gIndex}>
                                    <tr className="bg-indigo-500/5">
                                        <td colSpan={roles.length + 1} className="p-4 px-8 text-indigo-400 font-bold text-sm uppercase tracking-widest text-start">
                                            {group.title}
                                        </td>
                                    </tr>
                                    {group.permissions.map((perm) => (
                                        <tr key={perm.id} className="border-b border-zinc-800/50 hover:bg-white/5 transition-colors">
                                            <td className="p-6 text-zinc-300 font-medium text-start">
                                                {t(`permissions.${perm.id}` as any)}
                                            </td>
                                            {roles.map(role => (
                                                <td key={role.id} className="p-6 text-center border-x border-zinc-800/20">
                                                    {perm.roles.includes(role.id as any) || role.id === 'ADMIN' ? (
                                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400">
                                                            <HiBadgeCheck size={20} />
                                                        </div>
                                                    ) : (
                                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-zinc-600">
                                                            <HiOutlineLockClosed size={16} />
                                                        </div>
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note Section */}
            <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 flex gap-4 items-start">
                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <HiShieldCheck size={24} />
                </div>
                <div>
                    <h4 className="text-white font-bold mb-1">{t("securityNote.title")}</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        {t("securityNote.description")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RolesPage;
