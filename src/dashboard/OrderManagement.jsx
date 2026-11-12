import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Ban,
  Check,
  ChevronDown,
  Clock3,
  PackageCheck,
  Search,
  ShieldAlert,
  ShoppingBag,
  Truck,
  UsersRound,
} from "lucide-react";
import { getRegisteredUsers } from "../services/dashboardService";

const initialOrders = [
  {
    id: "ORD-2048",
    customerId: "customer-1",
    customer: "Amelia Parker",
    email: "amelia.parker@example.com",
    date: "Nov 5, 2026",
    items: "Wireless Headphones, Travel Case",
    quantity: 2,
    total: 128.0,
    status: "Processing",
  },
  {
    id: "ORD-2047",
    customerId: "customer-2",
    customer: "Noah Williams",
    email: "noah.williams@example.com",
    date: "Nov 5, 2026",
    items: "Minimalist Leather Watch",
    quantity: 1,
    total: 129.5,
    status: "Shipped",
  },
  {
    id: "ORD-2046",
    customerId: "customer-3",
    customer: "Olivia Chen",
    email: "olivia.chen@example.com",
    date: "Nov 4, 2026",
    items: "Ceramic Coffee Set, Pour-over Kettle",
    quantity: 3,
    total: 96.75,
    status: "Processing",
  },
  {
    id: "ORD-2045",
    customerId: "customer-4",
    customer: "Ethan Brooks",
    email: "ethan.brooks@example.com",
    date: "Nov 3, 2026",
    items: "Everyday Backpack",
    quantity: 1,
    total: 84.0,
    status: "Delivered",
  },
  {
    id: "ORD-2044",
    customerId: "customer-5",
    customer: "Sophia Turner",
    email: "sophia.turner@example.com",
    date: "Nov 2, 2026",
    items: "Linen Table Runner, Candle Set",
    quantity: 3,
    total: 72.5,
    status: "Shipped",
  },
];

const initialCustomers = [
  {
    id: "customer-1",
    name: "Amelia Parker",
    email: "amelia.parker@example.com",
    joined: "Oct 12, 2026",
    orders: 4,
    spent: 386.5,
    lastOrder: "Nov 5, 2026",
    accountStatus: "Active",
    history: [
      { id: "ORD-2048", date: "Nov 5, 2026", items: "2 items", total: 128.0 },
      { id: "ORD-1982", date: "Oct 28, 2026", items: "1 item", total: 79.5 },
      { id: "ORD-1840", date: "Oct 17, 2026", items: "3 items", total: 112.0 },
      { id: "ORD-1712", date: "Oct 12, 2026", items: "2 items", total: 67.0 },
    ],
  },
  {
    id: "customer-2",
    name: "Noah Williams",
    email: "noah.williams@example.com",
    joined: "Sep 8, 2026",
    orders: 2,
    spent: 214.49,
    lastOrder: "Nov 5, 2026",
    accountStatus: "Active",
    history: [
      { id: "ORD-2047", date: "Nov 5, 2026", items: "1 item", total: 129.5 },
      { id: "ORD-1610", date: "Sep 8, 2026", items: "2 items", total: 84.99 },
    ],
  },
  {
    id: "customer-3",
    name: "Olivia Chen",
    email: "olivia.chen@example.com",
    joined: "Aug 22, 2026",
    orders: 3,
    spent: 248.25,
    lastOrder: "Nov 4, 2026",
    accountStatus: "Active",
    history: [
      { id: "ORD-2046", date: "Nov 4, 2026", items: "3 items", total: 96.75 },
      { id: "ORD-1739", date: "Oct 2, 2026", items: "2 items", total: 101.5 },
      { id: "ORD-1504", date: "Aug 22, 2026", items: "1 item", total: 50.0 },
    ],
  },
  {
    id: "customer-4",
    name: "Ethan Brooks",
    email: "ethan.brooks@example.com",
    joined: "Jul 15, 2026",
    orders: 6,
    spent: 592.0,
    lastOrder: "Nov 3, 2026",
    accountStatus: "Active",
    history: [
      { id: "ORD-2045", date: "Nov 3, 2026", items: "1 item", total: 84.0 },
      { id: "ORD-1923", date: "Oct 25, 2026", items: "2 items", total: 108.0 },
      { id: "ORD-1808", date: "Oct 14, 2026", items: "1 item", total: 69.0 },
      { id: "ORD-1671", date: "Sep 29, 2026", items: "3 items", total: 121.0 },
      { id: "ORD-1563", date: "Aug 30, 2026", items: "2 items", total: 112.0 },
      { id: "ORD-1430", date: "Jul 15, 2026", items: "2 items", total: 98.0 },
    ],
  },
  {
    id: "customer-5",
    name: "Sophia Turner",
    email: "sophia.turner@example.com",
    joined: "Nov 1, 2026",
    orders: 1,
    spent: 72.5,
    lastOrder: "Nov 2, 2026",
    accountStatus: "Review",
    history: [
      { id: "ORD-2044", date: "Nov 2, 2026", items: "3 items", total: 72.5 },
    ],
  },
  {
    id: "customer-6",
    name: "Liam Foster",
    email: "liam.foster@example.com",
    joined: "Oct 30, 2026",
    orders: 0,
    spent: 0,
    lastOrder: "—",
    accountStatus: "Review",
    history: [],
  },
];

const orderStatuses = ["All orders", "Processing", "Shipped", "Delivered"];
const customerStatuses = ["All customers", "Active", "Review", "Blocked"];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function OrderManagement() {
  const [activeSection, setActiveSection] = useState("orders");
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("storeOrders");
    return savedOrders === null ? initialOrders : JSON.parse(savedOrders);
  });
  const [customers, setCustomers] = useState(() => {
    const savedCustomers = localStorage.getItem("storeCustomers");
    if (savedCustomers !== null) return JSON.parse(savedCustomers);

    const registeredCustomers = getRegisteredUsers().map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      joined: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      orders: 0,
      spent: 0,
      lastOrder: "—",
      accountStatus: "Active",
      history: [],
    }));
    return [...initialCustomers, ...registeredCustomers];
  });
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("All orders");
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerFilter, setCustomerFilter] = useState("All customers");
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  useEffect(() => {
    localStorage.setItem("storeOrders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("storeCustomers", JSON.stringify(customers));
  }, [customers]);

  const orderCounts = useMemo(
    () => ({
      processing: orders.filter((order) => order.status === "Processing")
        .length,
      shipped: orders.filter((order) => order.status === "Shipped").length,
      delivered: orders.filter((order) => order.status === "Delivered").length,
    }),
    [orders],
  );

  const reviewCount = customers.filter(
    (customer) => customer.accountStatus === "Review",
  ).length;

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

  const filteredCustomers = customers.filter((customer) => {
    const isBlocked = customer.accountStatus === "Blocked";
    const matchesFilter =
      customerFilter === "All customers" ||
      (customerFilter === "Blocked"
        ? isBlocked
        : customer.accountStatus === customerFilter);
    const searchTerm = customerSearch.trim().toLowerCase();
    const matchesSearch =
      !searchTerm ||
      [customer.name, customer.email].some((value) =>
        value.toLowerCase().includes(searchTerm),
      );

    return matchesFilter && matchesSearch;
  });

  function advanceOrder(orderId) {
    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId) return order;

        const nextStatus =
          order.status === "Processing" ? "Shipped" : "Delivered";
        return { ...order, status: nextStatus };
      }),
    );
  }

  function toggleCustomerBlock(customerId) {
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) => {
        if (customer.id !== customerId) return customer;

        return {
          ...customer,
          accountStatus:
            customer.accountStatus === "Blocked" ? "Active" : "Blocked",
        };
      }),
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-primary-text tracking-wider mb-1">STORE OPERATIONS</p>
          <h1 className="text-3xl">Orders & customers</h1>
          <p className="mt-1 text-sm text-muted">
            Track incoming orders and keep your customer accounts in good standing.
          </p>
        </div>
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
            <span className="text-sm font-semibold text-muted">Accounts to review</span>
            <span className="flex size-10 items-center justify-center rounded-control bg-red-500/10 text-red-500">
              <ShieldAlert size={19} />
            </span>
          </div>
          <strong className="mt-4 block font-heading text-3xl font-semibold text-ink">{reviewCount}</strong>
          <span className="mt-2 block text-xs text-muted">Flagged for your attention</span>
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
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-bold">{customers.length}</span>
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
                            order.status === "Processing"
                              ? "bg-amber-400/15 text-amber-500"
                              : order.status === "Shipped"
                              ? "bg-sky-400/15 text-sky-500"
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
                        ) : (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                            onClick={() => advanceOrder(order.id)}
                            aria-label={`Mark ${order.id} as ${order.status === "Processing" ? "shipped" : "delivered"}`}
                          >
                            {order.status === "Processing" ? "Mark shipped" : "Mark delivered"}
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
                <h2 className="text-xl font-bold text-ink">Registered customers</h2>
                <p className="text-sm text-muted mt-0.5">Review purchase history and manage account access.</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/25">
                {filteredCustomers.length}{" "}
                {filteredCustomers.length === 1 ? "customer" : "customers"}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-2 flex-1 min-w-[240px] rounded-control border border-line bg-page px-3.5 py-2.5 text-sm text-ink">
                <Search size={17} className="text-muted shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  value={customerSearch}
                  onChange={(event) => setCustomerSearch(event.target.value)}
                  placeholder="Search by name or email"
                  aria-label="Search customers by name or email"
                  className="w-full bg-transparent outline-none text-ink placeholder:text-muted"
                />
              </label>
              <div className="relative">
                <select
                  value={customerFilter}
                  onChange={(event) => setCustomerFilter(event.target.value)}
                  className="appearance-none rounded-control border border-line bg-page px-4 py-2.5 pr-10 text-sm font-semibold text-ink outline-none cursor-pointer"
                >
                  {customerStatuses.map((status) => (
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
                    <th scope="col" className="pb-3 px-3">Customer</th>
                    <th scope="col" className="pb-3 px-3">Joined</th>
                    <th scope="col" className="pb-3 px-3">Orders</th>
                    <th scope="col" className="pb-3 px-3">Total spent</th>
                    <th scope="col" className="pb-3 px-3">Account</th>
                    <th scope="col" className="pb-3 px-3 text-right">
                      <span className="sr-only">Account actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60 text-sm">
                  {filteredCustomers.map((customer) => {
                    const isExpanded = expandedCustomer === customer.id;
                    const isBlocked = customer.accountStatus === "Blocked";
                    const needsReview = customer.accountStatus === "Review";

                    return (
                      <FragmentCustomerRow
                        key={customer.id}
                        customer={customer}
                        isExpanded={isExpanded}
                        isBlocked={isBlocked}
                        needsReview={needsReview}
                        onToggleExpanded={() =>
                          setExpandedCustomer(isExpanded ? null : customer.id)
                        }
                        onToggleBlocked={() =>
                          toggleCustomerBlock(customer.id)
                        }
                      />
                    );
                  })}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td className="py-12 text-center text-muted text-sm" colSpan="6">
                        No customers match your search or account filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted pt-4 border-t border-line">
              <ShieldAlert size={17} className="text-primary" />
              <span>
                <strong className="text-ink">
                  {reviewCount} account{reviewCount === 1 ? "" : "s"} flagged for review.
                </strong>{" "}
                Review account activity before restricting access.
              </span>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
function FragmentCustomerRow({
  customer,
  isExpanded,
  isBlocked,
  needsReview,
  onToggleExpanded,
  onToggleBlocked,
}) {
  return (
    <>
      <tr className={`hover:bg-page/50 transition-colors ${isExpanded ? "bg-page/40" : ""}`}>
        <td className="py-4 px-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
              {customer.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <div>
              <div className="font-semibold text-ink">{customer.name}</div>
              <div className="text-xs text-muted">{customer.email}</div>
            </div>
          </div>
        </td>
        <td className="py-4 px-3 text-muted">{customer.joined}</td>
        <td className="py-4 px-3">
          <button
            type="button"
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline cursor-pointer text-xs"
            aria-expanded={isExpanded}
            onClick={onToggleExpanded}
          >
            {customer.orders} {customer.orders === 1 ? "order" : "orders"}
            <ChevronDown size={14} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </td>
        <td className="py-4 px-3 font-semibold text-ink">{formatCurrency(customer.spent)}</td>
        <td className="py-4 px-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
              customer.accountStatus === "Active"
                ? "bg-emerald-400/15 text-emerald-500"
                : customer.accountStatus === "Review"
                ? "bg-amber-400/15 text-amber-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {needsReview ? "Review needed" : customer.accountStatus}
          </span>
          <div className="text-xs text-muted mt-0.5">Last order: {customer.lastOrder}</div>
        </td>
        <td className="py-4 px-3 text-right">
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              isBlocked
                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
            }`}
            onClick={onToggleBlocked}
            aria-label={`${isBlocked ? "Unblock" : "Block"} ${customer.name}`}
          >
            {isBlocked ? <ShieldAlert size={15} /> : <Ban size={15} />}
            {isBlocked ? "Unblock" : "Block"}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-page/30">
          <td colSpan="6" className="p-4 sm:p-6">
            <div className="rounded-xl border border-line bg-surface p-4 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div>
                  <h3 className="font-bold text-ink text-base">Purchase history</h3>
                  <p className="text-xs text-muted">
                    {customer.name} · {customer.orders} total {customer.orders === 1 ? "order" : "orders"}
                  </p>
                </div>
                <strong className="text-sm text-ink font-bold">{formatCurrency(customer.spent)} total spent</strong>
              </div>
              {customer.history.length > 0 ? (
                <ul className="divide-y divide-line/60 text-xs">
                  {customer.history.map((item) => (
                    <li key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                      <span className="font-mono font-semibold text-primary">{item.id}</span>
                      <span className="text-muted">{item.date}</span>
                      <span className="text-ink font-medium">{item.items}</span>
                      <strong className="text-ink font-bold">{formatCurrency(item.total)}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-center text-xs text-muted">No purchases yet.</p>
              )}
              {needsReview && !isBlocked && (
                <p className="flex items-center gap-2 p-3 rounded-lg bg-amber-400/10 text-amber-600 text-xs font-medium border border-amber-400/20">
                  <ShieldAlert size={15} /> This account is flagged for review. Confirm its activity before blocking.
                </p>
              )}
              {isBlocked && (
                <p className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20">
                  <ShieldAlert size={15} /> This customer is blocked and cannot place orders.
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
export default OrderManagement;
