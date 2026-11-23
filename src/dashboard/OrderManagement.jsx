import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
  UsersRound,
} from "lucide-react";
import {
  getAdminOrders,
  getAdminUsers,
  updateAdminOrderStatus,
} from "../services/dashboardService";

const orderStatuses = ["All orders", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function mapAdminOrder(order) {
  const customerId =
    typeof order.customer === "string"
      ? order.customer
      : order.customer?._id || order.customer?.id || "";
  const firstName = order.customer?.profile?.firstName || "";
  const lastName = order.customer?.profile?.lastName || "";
  const rawStatus = String(order.status || "pending");

  return {
    id: String(order._id || order.id),
    customer: [firstName, lastName].filter(Boolean).join(" ") || "Customer",
    email: customerId ? `Customer ID: ${customerId}` : "",
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : "—",
    items: (order.items || [])
      .map((item) => `${item.productName} × ${item.quantity}`)
      .join(", "),
    quantity: (order.items || []).reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    ),
    total: Number(order.totals?.total) || 0,
    status: rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1),
  };
}

function getUserName(user) {
  return [user.profile?.firstName, user.profile?.lastName]
    .filter(Boolean)
    .join(" ") || user.email;
}

function OrderManagement() {
  const [activeSection, setActiveSection] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [ordersError, setOrdersError] = useState("");
  const [usersError, setUsersError] = useState("");
  const [usersLoading, setUsersLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("All orders");
  const [userSearch, setUserSearch] = useState("");

  useEffect(() => {
    let active = true;
    getAdminOrders()
      .then((result) => {
        if (active) setOrders(result.map(mapAdminOrder));
      })
      .catch((error) => {
        if (active) {
          setOrdersError(error instanceof Error ? error.message : "Unable to load orders.");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    getAdminUsers()
      .then((result) => {
        if (active) setUsers(result);
      })
      .catch((error) => {
        if (active) {
          setUsersError(error instanceof Error ? error.message : "Unable to load users.");
        }
      })
      .finally(() => {
        if (active) setUsersLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const orderCounts = useMemo(
    () => ({
      processing: orders.filter((order) => order.status === "Processing")
        .length,
      shipped: orders.filter((order) => order.status === "Shipped").length,
      delivered: orders.filter((order) => order.status === "Delivered").length,
    }),
    [orders],
  );

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      orderFilter === "All orders" || order.status === orderFilter;
    const searchTerm = orderSearch.trim().toLowerCase();
    const matchesSearch =
      !searchTerm ||
      [order.id, order.customer, order.email].some((value) =>
        value.toLowerCase().includes(searchTerm),
      );

    return matchesStatus && matchesSearch;
  });

  const filteredUsers = users.filter((user) => {
    const searchTerm = userSearch.trim().toLowerCase();
    return !searchTerm ||
      [getUserName(user), user.email].some((value) =>
        value.toLowerCase().includes(searchTerm),
      );
  });

  async function advanceOrder(order) {
    const nextStatus = {
      Pending: "Processing",
      Processing: "Shipped",
      Shipped: "Delivered",
    }[order.status];
    if (!nextStatus) return;

    setUpdatingOrderId(order.id);
    setOrdersError("");
    try {
      const updatedOrder = await updateAdminOrderStatus(order.id, nextStatus);
      setOrders((currentOrders) =>
        currentOrders.map((current) =>
          current.id === order.id ? mapAdminOrder(updatedOrder) : current,
        ),
      );
    } catch (error) {
      setOrdersError(error instanceof Error ? error.message : "Unable to update order status.");
    } finally {
      setUpdatingOrderId("");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-primary-text tracking-wider mb-1">STORE OPERATIONS</p>
          <h1 className="text-3xl">Orders & users</h1>
          <p className="mt-1 text-sm text-muted">
            Track incoming orders and view registered user accounts.
          </p>
        </div>
        {ordersError && (
          <p role="alert" className="rounded-control border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {ordersError}
          </p>
        )}
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted bg-surface border border-line px-3 py-1.5 rounded-full shadow-sm">
          <Clock3 size={15} className="text-primary" /> Live overview
        </span>
      </div>
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Store overview">
        <article className="rounded-card border border-line bg-surface p-5 shadow-card transition hover:-translate-y-1 hover:shadow-raised">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Total orders</span>
            <span className="flex size-10 items-center justify-center rounded-control bg-sky-400/15 text-sky-500">
              <ShoppingBag size={19} />
            </span>
          </div>
          <strong className="mt-4 block font-heading text-3xl font-semibold text-ink">{orders.length}</strong>
          <span className="mt-2 block text-xs text-muted">In this overview</span>
        </article>

        <article className="rounded-card border border-line bg-surface p-5 shadow-card transition hover:-translate-y-1 hover:shadow-raised">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Processing</span>
            <span className="flex size-10 items-center justify-center rounded-control bg-amber-400/15 text-amber-500">
              <Clock3 size={19} />
            </span>
          </div>
          <strong className="mt-4 block font-heading text-3xl font-semibold text-ink">{orderCounts.processing}</strong>
          <span className="mt-2 block text-xs text-muted">Waiting to be shipped</span>
        </article>

        <article className="rounded-card border border-line bg-surface p-5 shadow-card transition hover:-translate-y-1 hover:shadow-raised">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Shipped</span>
            <span className="flex size-10 items-center justify-center rounded-control bg-emerald-400/15 text-emerald-500">
              <Truck size={19} />
            </span>
          </div>
          <strong className="mt-4 block font-heading text-3xl font-semibold text-ink">{orderCounts.shipped}</strong>
          <span className="mt-2 block text-xs text-muted">On the way to customers</span>
        </article>

        <article className="rounded-card border border-line bg-surface p-5 shadow-card transition hover:-translate-y-1 hover:shadow-raised">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted">Registered users</span>
            <span className="flex size-10 items-center justify-center rounded-control bg-red-500/10 text-red-500">
              <UsersRound size={19} />
            </span>
          </div>
          <strong className="mt-4 block font-heading text-3xl font-semibold text-ink">{users.length}</strong>
          <span className="mt-2 block text-xs text-muted">Accounts in the database</span>
        </article>
      </section>
<section className="space-y-6">
        <div
          className="inline-flex rounded-control border border-line bg-page p-1 gap-1"
          role="tablist"
          aria-label="Management sections"
        >
          <button
            type="button"
            role="tab"
            id="orders-tab"
            aria-selected={activeSection === "orders"}
            aria-controls="orders-panel"
            className={`cursor-pointer flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeSection === "orders"
                ? "bg-surface text-ink shadow-card"
                : "text-muted hover:text-ink"
            }`}
            onClick={() => setActiveSection("orders")}
          >
            <ShoppingBag size={17} />
            Order tracking
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-bold">{orders.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            id="customers-tab"
            aria-selected={activeSection === "customers"}
            aria-controls="customers-panel"
            className={`cursor-pointer flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeSection === "customers"
                ? "bg-surface text-ink shadow-card"
                : "text-muted hover:text-ink"
            }`}
            onClick={() => setActiveSection("customers")}
          >
            <UsersRound size={17} />
            User management
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-bold">{users.length}</span>
          </button>
        </div>

        {activeSection === "orders" ? (
          <section
            id="orders-panel"
            role="tabpanel"
            aria-labelledby="orders-tab"
            className="rounded-card border border-line bg-surface p-6 shadow-card space-y-6"
          >
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h2 className="text-xl font-bold text-ink">Incoming orders</h2>
                <p className="text-sm text-muted mt-0.5">Update an order as it moves through fulfillment.</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/25">
                {filteredOrders.length}{" "}
                {filteredOrders.length === 1 ? "order" : "orders"}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-2 flex-1 min-w-[240px] rounded-control border border-line bg-page px-3.5 py-2.5 text-sm text-ink">
                <Search size={17} className="text-muted shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  value={orderSearch}
                  onChange={(event) => setOrderSearch(event.target.value)}
                  placeholder="Search order or customer"
                  aria-label="Search orders by order number or customer"
                  className="w-full bg-transparent outline-none text-ink placeholder:text-muted"
                />
              </label>
              <div className="relative">
                <select
                  value={orderFilter}
                  onChange={(event) => setOrderFilter(event.target.value)}
                  className="appearance-none rounded-control border border-line bg-page px-4 py-2.5 pr-10 text-sm font-semibold text-ink outline-none cursor-pointer"
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" aria-hidden="true" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line text-xs font-semibold text-muted uppercase tracking-wider">
                    <th scope="col" className="pb-3 px-3">Order</th>
                    <th scope="col" className="pb-3 px-3">Customer</th>
                    <th scope="col" className="pb-3 px-3">Date</th>
                    <th scope="col" className="pb-3 px-3">Items</th>
                    <th scope="col" className="pb-3 px-3">Total</th>
                    <th scope="col" className="pb-3 px-3">Status</th>
                    <th scope="col" className="pb-3 px-3 text-right">
                      <span className="sr-only">Update status</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60 text-sm">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-page/50 transition-colors">
                      <td className="py-4 px-3 font-mono font-semibold text-primary">{order.id}</td>
                      <td className="py-4 px-3">
                        <div className="font-semibold text-ink">{order.customer}</div>
                        <div className="text-xs text-muted">{order.email}</div>
                      </td>
                      <td className="py-4 px-3 text-muted">{order.date}</td>
                      <td className="py-4 px-3">
                        <div className="font-medium text-ink">
                          {order.quantity} {order.quantity === 1 ? "item" : "items"}
                        </div>
                        <div className="text-xs text-muted truncate max-w-[200px]">{order.items}</div>
                      </td>
                      <td className="py-4 px-3 font-semibold text-ink">{formatCurrency(order.total)}</td>
                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            order.status === "Pending" || order.status === "Processing"
                              ? "bg-amber-400/15 text-amber-500"
                              : order.status === "Shipped"
                              ? "bg-sky-400/15 text-sky-500"
                                : order.status === "Cancelled"
                                ? "bg-red-500/10 text-red-500"
                              : "bg-emerald-400/15 text-emerald-500"
                          }`}
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        {order.status === "Delivered" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold text-xs">
                            <Check size={15} /> Complete
                          </span>
                        ) : order.status === "Cancelled" ? (
                          <span className="text-red-500 font-semibold text-xs">Cancelled</span>
                        ) : (
                          <button
                            type="button"
                            disabled={updatingOrderId === order.id}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                            onClick={() => advanceOrder(order)}
                            aria-label={`Mark ${order.id} as ${
                              order.status === "Pending"
                                ? "processing"
                                : order.status === "Processing"
                                  ? "shipped"
                                  : "delivered"
                            }`}
                          >
                            {updatingOrderId === order.id
                              ? "Updating..."
                              : order.status === "Pending"
                                ? "Mark processing"
                                : order.status === "Processing"
                                  ? "Mark shipped"
                                  : "Mark delivered"}
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td className="py-12 text-center text-muted text-sm" colSpan="7">
                        No orders match your search. Try another name, order number, or status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted pt-4 border-t border-line">
              <PackageCheck size={17} className="text-primary" />
              <span>Orders follow this path:</span>
              <strong className="text-ink">Processing</strong>
              <ArrowRight size={13} />
              <strong className="text-ink">Shipped</strong>
              <ArrowRight size={13} />
              <strong className="text-ink">Delivered</strong>
            </div>
          </section>
        ) : (
          <section
            id="customers-panel"
            role="tabpanel"
            aria-labelledby="customers-tab"
            className="rounded-card border border-line bg-surface p-6 shadow-card space-y-6"
          >
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h2 className="text-xl font-bold text-ink">Registered users</h2>
                <p className="text-sm text-muted mt-0.5">Accounts registered with the store.</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/25">
                {filteredUsers.length}{" "}
                {filteredUsers.length === 1 ? "user" : "users"}
              </span>
            </div>
            {usersError && (
              <p role="alert" className="rounded-control border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {usersError}
              </p>
            )}

            <div>
              <label className="flex items-center gap-2 flex-1 min-w-[240px] rounded-control border border-line bg-page px-3.5 py-2.5 text-sm text-ink">
                <Search size={17} className="text-muted shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                  placeholder="Search by name or email"
                  aria-label="Search users by name or email"
                  className="w-full bg-transparent outline-none text-ink placeholder:text-muted"
                />
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-line text-xs font-semibold text-muted uppercase tracking-wider">
                    <th scope="col" className="pb-3 px-3">User</th>
                    <th scope="col" className="pb-3 px-3">Email</th>
                    <th scope="col" className="pb-3 px-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60 text-sm">
                  {filteredUsers.map((user) => {
                    const name = getUserName(user);
                    const initials = name
                      .split(/\s+/)
                      .map((part) => part[0])
                      .join("");

                    return (
                      <tr key={user.id} className="hover:bg-page/50 transition-colors">
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                              {initials}
                            </span>
                            <span className="font-semibold text-ink">{name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-muted">{user.email}</td>
                        <td className="py-4 px-3">
                          <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold capitalize text-primary">
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {!usersLoading && filteredUsers.length === 0 && (
                    <tr>
                      <td className="py-12 text-center text-muted text-sm" colSpan="3">
                        {users.length === 0
                          ? "No registered users."
                          : "No users match your search."}
                      </td>
                    </tr>
                  )}
                  {usersLoading && (
                    <tr>
                      <td className="py-12 text-center text-muted text-sm" colSpan="3">
                        Loading users...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
export default OrderManagement;
