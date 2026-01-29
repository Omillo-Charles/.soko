'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  Package, 
  Calendar, 
  MapPin, 
  Phone, 
  User as UserIcon,
  Loader2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useSellerOrders } from '@/hooks/useSellerOrders';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const statusIcons = {
  pending: Clock,
  processing: Loader2,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function SellerOrdersPage() {
  const { orders, isLoading, error, updateStatus, isUpdating } = useSellerOrders();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-foreground">Error loading orders</h1>
        <p className="text-muted-foreground mb-6">There was a problem fetching your shop's orders.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-28 lg:pb-8">
      <div className="mb-6">
        <Link 
          href="/account" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Shop Orders</h1>
          <p className="text-muted-foreground mt-1">Manage orders and update delivery status</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold w-fit">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-background border border-border rounded-3xl p-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-foreground">No orders yet</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            When customers purchase items from your shop, they will appear here.
          </p>
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-all"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status] || Clock;
            
            return (
              <div 
                key={order._id}
                className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-border bg-muted/30">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Order ID</p>
                      <p className="font-mono font-bold text-foreground">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</p>
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</p>
                      <div className="flex items-center gap-2 text-foreground">
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{order.user.name}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${order.status === 'processing' ? 'animate-spin' : ''}`} />
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Order Items */}
                  <div className="lg:col-span-2 p-6 border-r border-border">
                    <h3 className="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">Items in Order</h3>
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{item.name}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                              {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                              {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                              <p className="text-sm font-medium text-primary">KES {item.price.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Total for items</p>
                      <p className="text-lg font-bold text-foreground">KES {order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Delivery & Actions */}
                  <div className="p-6 bg-muted/10">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold mb-3 text-foreground uppercase tracking-wider">Shipping Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex gap-2 text-foreground">
                            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span>{order.shippingAddress.street}, {order.shippingAddress.city}</span>
                          </div>
                          <div className="flex gap-2 text-foreground">
                            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span>{order.shippingAddress.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold mb-3 text-foreground uppercase tracking-wider">Update Status</h3>
                        <div className="space-y-3">
                          <select 
                            value={order.status}
                            onChange={(e) => updateStatus({ orderId: order._id, status: e.target.value })}
                            disabled={isUpdating}
                            className="w-full px-4 py-2 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
                          >
                            {statuses.map(s => (
                              <option key={s} value={s} className="capitalize">{s}</option>
                            ))}
                          </select>
                          <p className="text-[10px] text-muted-foreground italic">
                            Updating status will notify the customer.
                          </p>
                        </div>
                      </div>

                      <Link 
                        href={`/account/orders/${order._id}`}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl border border-border hover:bg-muted text-sm font-medium transition-colors text-foreground"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Full Order Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
