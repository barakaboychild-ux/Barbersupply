"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Edit, Trash2, LogOut, Package, Image as ImageIcon, Loader2, Save, X, ShoppingBag, Eye, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Tab = 'products' | 'orders' | 'settings';

function StaffDashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');

    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>((tabParam as Tab) || 'products');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);
    const [orderView, setOrderView] = useState<'active' | 'history'>('active');

    const [settings, setSettings] = useState({
        social_instagram: '',
        social_facebook: '',
        social_twitter: ''
    });
    const [savingSettings, setSavingSettings] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        offer_price: "",
        category: "Clippers",
        stock_quantity: "0",
        image_url: "",
        offer_expiry: ""
    });

    useEffect(() => {
        checkAuth();
        fetchProducts();
        fetchOrders();
        fetchSettings();
    }, []);

    useEffect(() => {
        if (tabParam === 'products' || tabParam === 'orders' || tabParam === 'settings') {
            setActiveTab(tabParam as Tab);
        }
    }, [tabParam]);

    const checkAuth = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/staff/login');
            return;
        }

        const { data: staffData } = await supabase
            .from('staff_requests')
            .select('status')
            .eq('email', user.email)
            .single();

        if (!staffData || staffData.status !== 'approved') {
            router.push('/staff/login');
        }
        setLoading(false);
    };

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setProducts(data);
    };

    const fetchSettings = async () => {
        const { data, error } = await supabase.from('store_settings').select('*');
        if (data) {
            const newSettings = { ...settings };
            data.forEach(item => {
                if (item.key in newSettings) {
                    newSettings[item.key as keyof typeof newSettings] = item.value || '';
                }
            });
            setSettings(newSettings);
        }
    };

    const handleSaveSettings = async () => {
        setSavingSettings(true);
        try {
            for (const [key, value] of Object.entries(settings)) {
                const { error } = await supabase.from('store_settings').upsert({
                    key,
                    value,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'key' });

                if (error) throw error;
            }
            alert("Settings saved successfully!");
        } catch (error: any) {
            console.error("Error saving settings", error);
            alert(`Failed to save settings: ${error.message || "Unknown error"}`);
        } finally {
            setSavingSettings(false);
        }
    };

    const fetchOrders = async () => {
        setIsRefreshingOrders(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setOrders(data);

        // Artificial delay so the user sees the refresh actually happening
        setTimeout(() => setIsRefreshingOrders(false), 500);
    };

    const fetchOrderItems = async (orderId: string) => {
        const { data, error } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

        if (data) setOrderItems(data);
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (!error) {
            fetchOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status });
            }
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/staff/login');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `product-images/${fileName}`;

            const { data, error } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image_url: publicUrl });
        } catch (error) {
            alert("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            offer_price: formData.offer_price ? parseFloat(formData.offer_price) : null,
            stock_quantity: parseInt(formData.stock_quantity),
            offer_expiry: formData.offer_expiry || null
        };

        try {
            if (editingProduct) {
                const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('products').insert([productData]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            setEditingProduct(null);
            resetForm();
            fetchProducts();
        } catch (error) {
            alert("Error saving product");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            offer_price: "",
            category: "Clippers",
            stock_quantity: "0",
            image_url: "",
            offer_expiry: ""
        });
    };

    const deleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) fetchProducts();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'processing': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'delivered': return 'bg-green-50 text-green-600 border-green-200';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    const getPaymentLabel = (method: string) => {
        switch (method) {
            case 'delivery': return 'Pay on Delivery';
            case 'mpesa_stk': return 'M-Pesa STK';
            case 'till': return 'Till Number';
            default: return method || 'Pay on Delivery';
        }
    };

    const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

    const displayedOrders = orders.filter(o =>
        orderView === 'active'
            ? ['pending', 'processing'].includes(o.status)
            : ['delivered', 'cancelled'].includes(o.status)
    );

    if (loading && products.length === 0) {
        return (
            <div className="min-h-screen bg-navy flex items-center justify-center">
                <Loader2 className="animate-spin text-sky" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Main Content */}
            <main className="flex-1 p-12 w-full pt-32">
                <div className="max-w-7xl mx-auto space-y-12">

                    {/* ==================== PRODUCTS TAB ==================== */}
                    {activeTab === 'products' && (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black text-navy uppercase tracking-tighter">Inventory <br /><span className="text-sky text-stroke">Management</span></h1>
                                    <p className="text-navy/40 font-medium">Manage your professional catalog and stock levels.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        resetForm();
                                        setEditingProduct(null);
                                        setIsModalOpen(true);
                                    }}
                                    className="btn-primary flex items-center gap-3 py-4"
                                >
                                    <Plus size={20} />
                                    Add New Product
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 bg-ice rounded-2xl flex items-center justify-center text-sky">
                                            <Package size={24} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-navy/20">Total Products</span>
                                    </div>
                                    <div className="text-4xl font-black text-navy">{products.length}</div>
                                </div>
                            </div>

                            <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-navy/40">Product</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-navy/40">Category</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-navy/40">Price / Offer</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-navy/40">Stock</th>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-navy/40 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-ice/50 rounded-xl overflow-hidden shrink-0">
                                                            {item.image_url ? (
                                                                <img src={item.image_url} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-sky/20"><ImageIcon size={20} /></div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-navy uppercase">{item.name}</p>
                                                            <p className="text-[10px] text-navy/40 font-medium line-clamp-1">{item.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-xs font-bold text-navy/60">{item.category}</td>
                                                <td className="px-8 py-6">
                                                    <p className="text-sm font-black text-navy">Ksh {item.price}</p>
                                                    {item.offer_price && <p className="text-[10px] text-sky font-bold">Offer: Ksh {item.offer_price}</p>}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${item.stock_quantity > 10 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                        {item.stock_quantity} in stock
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingProduct(item);
                                                                setFormData({
                                                                    name: item.name,
                                                                    description: item.description || "",
                                                                    price: item.price.toString(),
                                                                    offer_price: (item.offer_price || "").toString(),
                                                                    category: item.category,
                                                                    stock_quantity: item.stock_quantity.toString(),
                                                                    image_url: item.image_url || "",
                                                                    offer_expiry: item.offer_expiry ? item.offer_expiry.slice(0, 16) : ""
                                                                });
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="p-2 text-navy/20 hover:text-sky transition-colors"
                                                        >
                                                            <Edit size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteProduct(item.id)}
                                                            className="p-2 text-navy/20 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* ==================== ORDERS TAB ==================== */}
                    {activeTab === 'orders' && (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-black text-navy uppercase tracking-tighter">Customer <br /><span className="text-sky text-stroke">Orders</span></h1>
                                    <p className="text-navy/40 font-medium">Track and manage incoming customer orders.</p>
                                </div>
                                <button
                                    onClick={fetchOrders}
                                    disabled={isRefreshingOrders}
                                    className="btn-secondary flex items-center gap-3 py-4 disabled:opacity-50"
                                >
                                    <Loader2 size={18} className={isRefreshingOrders ? "animate-spin" : ""} />
                                    {isRefreshingOrders ? "Refreshing..." : "Refresh"}
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { label: 'Total Orders', value: orders.length, color: 'text-navy' },
                                    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'text-amber-500' },
                                    { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'text-blue-500' },
                                    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'text-green-500' },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-navy/20">{stat.label}</span>
                                        <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Order View Toggle */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setOrderView('active')}
                                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${orderView === 'active' ? 'bg-navy text-white shadow-xl' : 'bg-white text-navy/40 hover:bg-gray-50 border border-gray-100'}`}
                                >
                                    Active Orders
                                </button>
                                <button
                                    onClick={() => setOrderView('history')}
                                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${orderView === 'history' ? 'bg-navy text-white shadow-xl' : 'bg-white text-navy/40 hover:bg-gray-50 border border-gray-100'}`}
                                >
                                    Order History
                                </button>
                            </div>

                            {displayedOrders.length === 0 ? (
                                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 p-20 text-center space-y-6">
                                    <div className="w-20 h-20 bg-ice rounded-full flex items-center justify-center mx-auto text-sky/30">
                                        <ShoppingBag size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-navy uppercase">No {orderView === 'active' ? 'Active' : 'Completed'} Orders</h3>
                                        <p className="text-navy/40 font-medium">Orders will appear here.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-navy/40">Customer</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-navy/40">Total</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-navy/40">Payment</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-navy/40">Status</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-navy/40">Date</th>
                                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-navy/40 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {displayedOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div>
                                                            <p className="text-sm font-black text-navy">{order.customer_name}</p>
                                                            <p className="text-[10px] text-navy/40 font-bold">{order.customer_phone}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="text-sm font-black text-navy">Ksh {parseFloat(order.total_amount).toFixed(2)}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-navy/60">
                                                            {getPaymentLabel(order.payment_method)}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="relative inline-block">
                                                            <select
                                                                value={order.status}
                                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                                className={`appearance-none text-[10px] font-black uppercase tracking-widest px-4 py-2 pr-8 rounded-full border cursor-pointer outline-none ${getStatusColor(order.status)}`}
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="processing">Processing</option>
                                                                <option value="delivered">Delivered</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="text-[10px] font-bold text-navy/40">
                                                            {new Date(order.created_at).toLocaleDateString('en-GB', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(order);
                                                                fetchOrderItems(order.id);
                                                            }}
                                                            className="p-2 text-navy/20 hover:text-sky transition-colors"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}

                    {/* ==================== SETTINGS TAB ==================== */}
                    {activeTab === 'settings' && (
                        <div className="max-w-3xl space-y-8">
                            <div className="space-y-2 mb-10">
                                <h1 className="text-4xl font-black text-navy uppercase tracking-tighter">Store <br /><span className="text-sky text-stroke">Settings</span></h1>
                                <p className="text-navy/40 font-medium">Manage your storefront's contact and social links.</p>
                            </div>

                            <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-gray-100 space-y-8">
                                <div className="space-y-2 border-b border-gray-100 pb-6">
                                    <h3 className="text-xl font-black text-navy uppercase tracking-tighter">Social Media Links</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Instagram URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://instagram.com/yourhandle"
                                            className="w-full px-8 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                            value={settings.social_instagram}
                                            onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Facebook URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://facebook.com/yourpage"
                                            className="w-full px-8 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                            value={settings.social_facebook}
                                            onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Twitter URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://twitter.com/yourhandle"
                                            className="w-full px-8 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                            value={settings.social_twitter}
                                            onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })}
                                        />
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            onClick={handleSaveSettings}
                                            disabled={savingSettings}
                                            className="btn-primary w-full py-5 flex items-center justify-center gap-3"
                                        >
                                            {savingSettings ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                            Save Settings
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* ==================== PRODUCT MODAL ==================== */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h2 className="text-3xl font-black text-navy uppercase tracking-tighter">{editingProduct ? 'Edit' : 'Add New'} Product</h2>
                                <p className="text-navy/40 font-medium">Define your product details and pricing.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 rounded-full hover:bg-ice transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Product Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-8 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Category</label>
                                    <select
                                        className="w-full px-8 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {['Clippers', 'Trimmers', 'Shaving products', 'Hair products', 'Cosmetics', 'Accessories'].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Base Price (Ksh)</label>
                                        <input
                                            required
                                            type="number" step="0.01"
                                            className="w-full px-8 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Offer Price (Ksh)</label>
                                        <input
                                            type="number" step="0.01"
                                            className="w-full px-8 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                            value={formData.offer_price}
                                            onChange={(e) => setFormData({ ...formData, offer_price: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Stock Quantity</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-8 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                        value={formData.stock_quantity}
                                        onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2 text-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 inline-block mb-2">Product Image</label>
                                    <div className="aspect-square bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">
                                        {formData.image_url ? (
                                            <>
                                                <img src={formData.image_url} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => setFormData({ ...formData, image_url: '' })} className="text-white text-xs font-bold uppercase tracking-widest">Remove</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <ImageIcon size={48} className="text-sky/20 mb-4" />
                                                <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Drop image or click</p>
                                            </>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                <Loader2 className="animate-spin text-sky" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Offer Expiry (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full px-8 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none"
                                        value={formData.offer_expiry}
                                        onChange={(e) => setFormData({ ...formData, offer_expiry: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4">Description</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-8 py-4 bg-gray-50 border-none rounded-3xl text-sm font-bold focus:ring-2 focus:ring-sky/20 transition-all outline-none resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2 pt-6">
                                <button
                                    disabled={loading || uploading}
                                    type="submit"
                                    className="w-full btn-primary py-5 text-sm flex items-center justify-center gap-4"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                    {editingProduct ? 'Save Changes' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ==================== ORDER DETAIL MODAL ==================== */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-2xl font-black text-navy uppercase tracking-tighter">Order Details</h2>
                                <p className="text-[10px] font-bold text-navy/30 uppercase tracking-widest">ID: {selectedOrder.id.slice(0, 8)}...</p>
                            </div>
                            <button onClick={() => { setSelectedOrder(null); setOrderItems([]); }} className="p-3 bg-gray-50 rounded-full hover:bg-ice transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-navy/30">Customer</span>
                                    <p className="text-sm font-black text-navy">{selectedOrder.customer_name}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-navy/30">Phone</span>
                                    <p className="text-sm font-black text-navy">{selectedOrder.customer_phone}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-navy/30">Delivery Address</span>
                                    <p className="text-sm font-bold text-navy/60">{selectedOrder.delivery_address}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-navy/30">Payment</span>
                                    <p className="text-sm font-black text-navy">{getPaymentLabel(selectedOrder.payment_method)}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-navy/30">Status</span>
                                    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-sky">Items Ordered</h3>
                                <div className="divide-y divide-gray-100 bg-gray-50/50 rounded-2xl px-6 py-2">
                                    {orderItems.map((item) => (
                                        <div key={item.id} className="py-4 flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-black text-navy uppercase">{item.product_name}</p>
                                                <p className="text-[10px] font-bold text-navy/40">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-black text-navy">Ksh {(item.price_at_purchase * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                                <span className="text-lg font-black text-navy uppercase tracking-tighter">Total</span>
                                <span className="text-2xl font-black text-sky">Ksh {parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                            </div>

                            {/* Status Update */}
                            <div className="pt-4 space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-navy/30">Update Status</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    {['pending', 'processing', 'delivered', 'cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedOrder.status === status
                                                ? getStatusColor(status)
                                                : 'bg-gray-50 text-navy/30 border-gray-100 hover:border-gray-300'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function StaffDashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-sky border-t-transparent" /></div>}>
            <StaffDashboardContent />
        </Suspense>
    );
}
