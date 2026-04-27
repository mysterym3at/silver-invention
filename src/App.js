

// App.js
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AddHandbagButton from "./components/AddHandbagButton.js";
import HandbagsJsonViewer from "./components/HandbagsJsonViewer.js";
import DesignsJsonViewer from "./components/DesignsJsonViewer.js";
import Handbags from "./components/Handbags.js";           // your admin CRUD page
import HandbagSearch from "./components/HandbagSearch.js"; 
import AddOrUpdateHandbagsButton from "./components/AddOrUpdateHandbagsButton.js"; 
import AddOrUpdateShapesButton from "./components/AddOrUpdateShapesButton.js"; 
import AddOrUpdateDesignsButton from "./components/AddOrUpdateDesignsButton.js";
import AddOrUpdateColorsButton from "./components/AddOrUpdateColorsButton.js";
import AddOrUpdateRangesButton from "./components/AddOrUpdateRangesButton.js";
import Shapes from "./components/Shapes.js";
import Designs from "./components/Designs.js";
import HBDesigns from "./components/HBDesigns.js";
import Ranges from "./components/Ranges.js";






const App = () => {
  return (
    <div style={{ margin: 40 }}>
      {/* Simple navigation links */}

      <nav style={{ marginBottom: 20, display:"flex", flexDirection: "row", justifyContent: "flex-start"}}>
        {/* User view */}

        {/* ** HANDBAGS ** */}
        <div style={{alignItems:"center" ,width:300, marginRight: 20, marginTop:20 }}>
           <h5 style={{alignItems:"center" }}>Handbags</h5> <hr></hr>
        <ul>
          <li style={{marginBottom:20 }}>

   <Link to="/" style={{marginBottom:50, textDecoration: "none" }}>
         Search - Handbags
        </Link>

</li>
          <h6 style={{ marginBottom:20, textDecoration: "none" }}>Admin
            </h6> <hr></hr>

          <li style={{marginBottom:5 }}> <Link to="/"  style={{ paddingBottom:20, textDecoration: "none" }}>FORM: Add Update Handbags</Link></li>

          <li style={{marginBottom:5 }}> <Link to="/admin/handbags/addupdate/json"  style={{marginTop:20, textDecoration: "none" }}>JSON: Add Update Handbags</Link></li>

 <li> <Link to="/admin/handbags/export/json"  style={{ marginRight: 15,marginBottom:15, textDecoration: "none" }}>Export View JSON Handbags</Link></li>


        </ul>
        </div>
     
       

         {/* ** DESIGNS ** */}
         <div style={{alignItems:"center" ,width:300, marginRight: 20, marginTop:20 }}>
           <h5 style={{alignItems:"center" }}>Designs</h5> <hr></hr>
        <ul>
          <li style={{marginBottom:20 }}>

   <Link to="/handbags/search" style={{marginBottom:50, textDecoration: "none" }}>
         Search - Handbags
        </Link>

</li>
          <h6 style={{ marginBottom:20, textDecoration: "none" }}>Admin
            </h6> <hr></hr>

          <li style={{marginBottom:5 }}> <Link to="/admin/designs/addupdate/form"  style={{ paddingBottom:20, textDecoration: "none" }}>FORM: Add Update Designs </Link></li>

          <li style={{marginBottom:5 }}> <Link to="/admin/designs/addupdate/json"  style={{marginTop:20, textDecoration: "none" }}>JSON: Add Update Designs</Link></li>

 <li> <Link to="/admin/designs/export/json"  style={{ marginRight: 15,marginBottom:15, textDecoration: "none" }}>Export View JSON Designs</Link></li>


        </ul>
        </div>

        {/* update */}
              <Link to="/admin/hbdesigns/addupdate/form"  style={{ marginRight: 15 }}>Add Update Handbags Designs - Form</Link>
       
           <Link to="/admin/shapes/addupdate/form" style={{ marginRight: 15 }}>
        Add Update Shapes - Form
        </Link>
          <Link to="/admin/designs/addupdate/form" style={{ marginRight: 15 }}>
        Add Update Designs - Form
        </Link>

          <Link to="/admin/ranges/addupdate/form" style={{ marginRight: 15 }}>
        Add Update Ranges - Form
        </Link>
    
         <Link to="/admin/shapes/addupdate/json"  style={{ marginRight: 15 }}>Add Update Shapes</Link>
           <Link to="/admin/designs/addupdate/json"  style={{ marginRight: 15 }}>Add Update Designs</Link>
       
             <Link to="/ranges"  style={{ marginRight: 15 }}>Add Update Ranges</Link>
      </nav>

      {/* Define routes */}
      <Routes>
         <Route path="/admin/hbdesigns/addupdate/form" element={<HBDesigns />} /> 
        <Route path="/admin/handbags/addupdate/form" element={<Handbags />} />
         <Route path="/admin/handbags/addupdate/form" element={<Handbags />} />
        
          <Route path="/admin/shapes/addupdate/form" element={<Shapes />} />

              <Route path="/admin/designs/addupdate/form" element={<Designs />} />

                  <Route path="/admin/ranges/addupdate/form" element={<Ranges />} />

            <Route path="/admin/handbags/addupdate/json" element={<AddOrUpdateHandbagsButton />} />
  <Route path="/admin/designs/export/json" element={<DesignsJsonViewer />} />
             <Route path="/admin/handbags/export/json" element={<HandbagsJsonViewer />} />
        <Route path="/" element={<HandbagSearch />} />
          <Route path="/admin/shapes/addupdate/json" element={<AddOrUpdateShapesButton />} />
            <Route path="/admin/designs/addupdate/json" element={<AddOrUpdateDesignsButton />} />
              <Route path="/admin/ranges/addupdate/json" element={<AddOrUpdateRangesButton />} />
             
      </Routes>
    </div>
  );
};

export default App;
