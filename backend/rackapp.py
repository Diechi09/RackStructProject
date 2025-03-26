from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend connection (like Lovable)

# Path to your Excel file (must be in the same folder as this script)
FILE_PATH = "PJL AW25 Returns COPY.xlsx"

# Load inventory from Excel
def load_inventory():
    df = pd.read_excel(FILE_PATH, sheet_name="Ecom ret")
    inventory = df[["EAN", "Rack", "Model", "Color name", "SIZE", "Brand"]].dropna()
    return inventory.to_dict(orient="records")

# Initial load
inventory_data = load_inventory()

# Home route for sanity check
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Rack API is running!"})

# Search item by barcode
@app.route("/search", methods=["GET"])
def search_item():
    barcode = request.args.get("barcode")
    if not barcode:
        return jsonify({"error": "Missing barcode parameter"}), 400
    
    results = [item for item in inventory_data if str(item["EAN"]) == barcode]
    return jsonify(results if results else {"message": "Item not found"})

# Get all items in a rack
@app.route("/rack/<rack_id>", methods=["GET"])
def get_rack_items(rack_id):
    results = [item for item in inventory_data if str(item["Rack"]) == rack_id]
    return jsonify(results)

# Manual reload from Excel
@app.route("/update", methods=["POST"])
def update_inventory():
    global inventory_data
    inventory_data = load_inventory()
    return jsonify({"message": "Inventory updated from Excel"})

# Run the server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
