import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";


export default function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);


    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const res = await API.get("/orders");
        setOrders(res.data);
    };

    const createOrder = async () => {
        const totalAmount = quantity * price;

        await API.post("/orders", {
            items: [
                {
                    name: itemName,
                    quantity,
                    price,
                },
            ],
            totalAmount,
        });

        // clear inputs after creation
        setItemName("");
        setQuantity(1);
        setPrice(0);

        fetchOrders();
    };


    const deleteOrder = async (id) => {
        try {
            await API.delete(`/orders/${id}`);
            fetchOrders();
        } catch (error) {
            console.log(error);
        }
    };


    const role = localStorage.getItem("role");


    return (
        <>
            <Navbar />

            <div style={{ padding: "20px" }}>
                <h2>Dashboard</h2><br />

                <h3>Create New Order</h3>

                <input
                    placeholder="Item Name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                />

                <br /><br />


                <button onClick={createOrder}>
                    Create Order
                </button>

                {orders.map((order) => (
                    <div
                        key={order._id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "12px",
                            marginBottom: "12px"
                        }}
                    >
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Total:</strong> ₹{order.totalAmount}</p>

                        {role === "admin" && (
                            <button onClick={() => deleteOrder(order._id)}>
                                Delete Order
                            </button>
                        )}

                        <h4>Order History</h4>

                        <ul>
                            {order.history && order.history.length > 0 ? (
                                order.history.map((h, index) => (
                                    <li key={index}>
                                        {h.status} —{" "}
                                        {new Date(h.updatedAt).toLocaleString()}
                                    </li>
                                ))
                            ) : (
                                <li>No history available</li>
                            )}
                        </ul>
                    </div>
                ))}

            </div>
        </>
    );

}
