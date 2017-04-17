// Vendor libs
import * as React from "react";
import * as ReactDOM from "react-dom";

// Local libs
import { Layout } from "./components/Layout";

// Load Styles
require("../stylesheet/base.css");

// Render app
const app = document.getElementById('application');
ReactDOM.render(<Layout/>, app);