import { useMemo, useState } from "react";
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
  const [orders, setOrders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("All orders");
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerFilter, setCustomerFilter] = useState("All customers");
  const [expandedCustomer, setExpandedCustomer] = useState(null);

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
    <main className="order-management">
      <header className="om-topbar">
        <div className="om-brand">
          <span className="om-brand-mark" aria-hidden="true">
            <ShoppingBag size={19} />
          </span>
          <span>
            Omni <span className="om-brand-light">Admin</span>
          </span>
        </div>
        <div className="om-topbar-right">
          <span className="om-admin-avatar" aria-hidden="true">
            A
          </span>
          <span className="om-admin-label">Store admin</span>
        </div>
      </header>

      <div className="om-content">
        <div className="om-breadcrumb">
          <span>Dashboard</span>
          <span className="om-breadcrumb-divider">/</span>
          <span className="om-breadcrumb-current">Orders &amp; customers</span>
        </div>

        <section className="om-heading">
          <div>
            <p className="om-eyebrow">STORE OPERATIONS</p>
            <h1>Orders &amp; customers</h1>
            <p className="om-subtitle">
              Track incoming orders and keep your customer accounts in good
              standing.
            </p>
          </div>
          <span className="om-updated">
            <Clock3 size={15} /> Live overview
          </span>
        </section>

        <section className="om-stat-grid" aria-label="Store overview">
          <article className="om-stat-card">
            <span className="om-stat-icon om-stat-icon-blue">
              <ShoppingBag size={19} />
            </span>
            <span className="om-stat-label">Total orders</span>
            <strong>{orders.length}</strong>
            <span className="om-stat-foot">In this overview</span>
          </article>
          <article className="om-stat-card">
            <span className="om-stat-icon om-stat-icon-amber">
              <Clock3 size={19} />
            </span>
            <span className="om-stat-label">Processing</span>
            <strong>{orderCounts.processing}</strong>
            <span className="om-stat-foot">Waiting to be shipped</span>
          </article>
          <article className="om-stat-card">
            <span className="om-stat-icon om-stat-icon-green">
              <Truck size={19} />
            </span>
            <span className="om-stat-label">Shipped</span>
            <strong>{orderCounts.shipped}</strong>
            <span className="om-stat-foot">On the way to customers</span>
          </article>
          <article className="om-stat-card">
            <span className="om-stat-icon om-stat-icon-red">
              <ShieldAlert size={19} />
            </span>
            <span className="om-stat-label">Accounts to review</span>
            <strong>{reviewCount}</strong>
            <span className="om-stat-foot">Flagged for your attention</span>
          </article>
        </section>

        <section className="om-workspace">
          <div
            className="om-tabs"
            role="tablist"
            aria-label="Management sections"
          >
            <button
              type="button"
              role="tab"
              id="orders-tab"
              aria-selected={activeSection === "orders"}
              aria-controls="orders-panel"
              className={`om-tab${activeSection === "orders" ? " is-active" : ""}`}
              onClick={() => setActiveSection("orders")}
            >
              <ShoppingBag size={17} />
              Order tracking
              <span className="om-tab-count">{orders.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              id="customers-tab"
              aria-selected={activeSection === "customers"}
              aria-controls="customers-panel"
              className={`om-tab${activeSection === "customers" ? " is-active" : ""}`}
              onClick={() => setActiveSection("customers")}
            >
              <UsersRound size={17} />
              User management
              <span className="om-tab-count">{customers.length}</span>
            </button>
          </div>

          {activeSection === "orders" ? (
            <section
              id="orders-panel"
              role="tabpanel"
              aria-labelledby="orders-tab"
              className="om-panel"
            >
              <div className="om-panel-heading">
                <div>
                  <h2>Incoming orders</h2>
                  <p>Update an order as it moves through fulfillment.</p>
                </div>
                <span className="om-total-label">
                  {filteredOrders.length}{" "}
                  {filteredOrders.length === 1 ? "order" : "orders"}
                </span>
              </div>

              <div className="om-toolbar">
                <label className="om-search">
                  <Search size={17} aria-hidden="true" />
                  <input
                    type="search"
                    value={orderSearch}
                    onChange={(event) => setOrderSearch(event.target.value)}
                    placeholder="Search order or customer"
                    aria-label="Search orders by order number or customer"
                  />
                </label>
                <label className="om-select-wrap">
                  <span className="om-sr-only">Filter orders by status</span>
                  <select
                    value={orderFilter}
                    onChange={(event) => setOrderFilter(event.target.value)}
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} aria-hidden="true" />
                </label>
              </div>

              <div className="om-table-scroll">
                <table className="om-table">
                  <thead>
                    <tr>
                      <th scope="col">Order</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Date</th>
                      <th scope="col">Items</th>
                      <th scope="col">Total</th>
                      <th scope="col">Status</th>
                      <th scope="col">
                        <span className="om-sr-only">Update status</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <span className="om-order-id">{order.id}</span>
                        </td>
                        <td>
                          <span className="om-cell-primary">
                            {order.customer}
                          </span>
                          <span className="om-cell-secondary">
                            {order.email}
                          </span>
                        </td>
                        <td className="om-cell-muted">{order.date}</td>
                        <td>
                          <span className="om-cell-primary">
                            {order.quantity}{" "}
                            {order.quantity === 1 ? "item" : "items"}
                          </span>
                          <span className="om-cell-secondary om-item-name">
                            {order.items}
                          </span>
                        </td>
                        <td className="om-cell-primary">
                          {formatCurrency(order.total)}
                        </td>
                        <td>
                          <span
                            className={`om-status om-status-${order.status.toLowerCase()}`}
                          >
                            <span className="om-status-dot" />
                            {order.status}
                          </span>
                        </td>
                        <td className="om-action-cell">
                          {order.status === "Delivered" ? (
                            <span className="om-complete">
                              <Check size={15} /> Complete
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="om-advance-button"
                              onClick={() => advanceOrder(order.id)}
                              aria-label={`Mark ${order.id} as ${order.status === "Processing" ? "shipped" : "delivered"}`}
                            >
                              {order.status === "Processing"
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
                        <td className="om-empty" colSpan="7">
                          No orders match your search. Try another name, order
                          number, or status.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="om-flow-note">
                <PackageCheck size={17} />
                <span>Orders follow this path:</span>
                <strong>Processing</strong>
                <ArrowRight size={13} />
                <strong>Shipped</strong>
                <ArrowRight size={13} />
                <strong>Delivered</strong>
              </div>
            </section>
          ) : (
            <section
              id="customers-panel"
              role="tabpanel"
              aria-labelledby="customers-tab"
              className="om-panel"
            >
              <div className="om-panel-heading">
                <div>
                  <h2>Registered customers</h2>
                  <p>Review purchase history and manage account access.</p>
                </div>
                <span className="om-total-label">
                  {filteredCustomers.length}{" "}
                  {filteredCustomers.length === 1 ? "customer" : "customers"}
                </span>
              </div>

              <div className="om-toolbar">
                <label className="om-search">
                  <Search size={17} aria-hidden="true" />
                  <input
                    type="search"
                    value={customerSearch}
                    onChange={(event) => setCustomerSearch(event.target.value)}
                    placeholder="Search by name or email"
                    aria-label="Search customers by name or email"
                  />
                </label>
                <label className="om-select-wrap">
                  <span className="om-sr-only">
                    Filter customers by account status
                  </span>
                  <select
                    value={customerFilter}
                    onChange={(event) => setCustomerFilter(event.target.value)}
                  >
                    {customerStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} aria-hidden="true" />
                </label>
              </div>

              <div className="om-table-scroll">
                <table className="om-table om-customer-table">
                  <thead>
                    <tr>
                      <th scope="col">Customer</th>
                      <th scope="col">Joined</th>
                      <th scope="col">Orders</th>
                      <th scope="col">Total spent</th>
                      <th scope="col">Account</th>
                      <th scope="col">
                        <span className="om-sr-only">Account actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
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
                        <td className="om-empty" colSpan="6">
                          No customers match your search or account filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="om-review-note">
                <ShieldAlert size={17} />
                <span>
                  <strong>
                    {reviewCount} account{reviewCount === 1 ? "" : "s"} flagged
                    for review.
                  </strong>{" "}
                  Review account activity before restricting access.
                </span>
              </div>
            </section>
          )}
        </section>
      </div>
    </main>
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
      <tr
        className={
          isExpanded ? "om-customer-row is-expanded" : "om-customer-row"
        }
      >
        <td>
          <span className="om-customer-name">
            <span className="om-customer-avatar" aria-hidden="true">
              {customer.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <span>
              <span className="om-cell-primary">{customer.name}</span>
              <span className="om-cell-secondary">{customer.email}</span>
            </span>
          </span>
        </td>
        <td className="om-cell-muted">{customer.joined}</td>
        <td>
          <button
            type="button"
            className="om-history-button"
            aria-expanded={isExpanded}
            onClick={onToggleExpanded}
          >
            {customer.orders} {customer.orders === 1 ? "order" : "orders"}
            <ChevronDown size={14} className={isExpanded ? "is-rotated" : ""} />
          </button>
        </td>
        <td className="om-cell-primary">{formatCurrency(customer.spent)}</td>
        <td>
          <span
            className={`om-status om-account-${customer.accountStatus.toLowerCase()}`}
          >
            <span className="om-status-dot" />
            {needsReview ? "Review needed" : customer.accountStatus}
          </span>
          <span className="om-last-order">
            Last order: {customer.lastOrder}
          </span>
        </td>
        <td className="om-action-cell">
          <button
            type="button"
            className={isBlocked ? "om-unblock-button" : "om-block-button"}
            onClick={onToggleBlocked}
            aria-label={`${isBlocked ? "Unblock" : "Block"} ${customer.name}`}
          >
            {isBlocked ? <ShieldAlert size={15} /> : <Ban size={15} />}
            {isBlocked ? "Unblock" : "Block"}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr className="om-history-row">
          <td colSpan="6">
            <div className="om-history-content">
              <div className="om-history-heading">
                <div>
                  <h3>Purchase history</h3>
                  <p>
                    {customer.name} · {customer.orders} total{" "}
                    {customer.orders === 1 ? "order" : "orders"}
                  </p>
                </div>
                <strong>{formatCurrency(customer.spent)} total spent</strong>
              </div>
              {customer.history.length > 0 ? (
                <ul className="om-history-list">
                  {customer.history.map((item) => (
                    <li key={item.id}>
                      <span className="om-order-id">{item.id}</span>
                      <span>{item.date}</span>
                      <span>{item.items}</span>
                      <strong>{formatCurrency(item.total)}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="om-no-history">No purchases yet.</p>
              )}
              {needsReview && !isBlocked && (
                <p className="om-customer-warning">
                  <ShieldAlert size={15} /> This account is flagged for review.
                  Confirm its activity before blocking.
                </p>
              )}
              {isBlocked && (
                <p className="om-customer-warning is-blocked">
                  <ShieldAlert size={15} /> This customer is blocked and cannot
                  place orders.
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
