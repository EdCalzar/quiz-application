import { useState } from "react";

export default function OnChange() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [select, setSelect] = useState("");
  const [shipping, setShipping] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSelectChange = (e) => {
    setSelect(e.target.value);
  };

  const handleShippingChange = (e) => {
    setShipping(e.target.value);
  };

  return (
    <>
      <input type="text" value={name} onChange={handleNameChange} />
      <p>Name: {name}</p>

      <input type="number" value={quantity} onChange={handleQuantityChange} />
      <p>Quantity: {quantity}</p>

      <textarea value={comment} onChange={handleCommentChange}></textarea>
      <p>Comment: {comment}</p>

      <select value={select} onChange={handleSelectChange}>
        <option value="">Select an option</option>
        <option value="Gcash">Gcash</option>
        <option value="PayMaya">PayMaya</option>
      </select>
      <p>Payment Method: {select}</p>

      <label>
        <input
          type="radio"
          value={"Pick Up"}
          checked={shipping === "Pick Up"}
          onChange={handleShippingChange}
        />
        Pick Up
      </label>
      <label>
        <input
          type="radio"
          value={"Delivery"}
          checked={shipping === "Delivery"}
          onChange={handleShippingChange}
        />
        Delivery
      </label>
      <p>Shipping Delivery: {shipping}</p>
    </>
  );
}
