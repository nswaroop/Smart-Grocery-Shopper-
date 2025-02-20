// CheckoutModal.js
import CheckIcon from '@mui/icons-material/Check';
import React, { Fragment,useState }  from "react";
import Stack from '@mui/material/Stack';
import {
  Modal,
  Paper,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@material-ui/core";
import Alert from '@mui/material/Alert';
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { styled } from '@mui/material/styles';
import { red } from "@mui/material/colors";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor:"rgba(209, 206, 206, 0.695)",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const ItemsList = ({ items }) => {
    return (
      <div className="items-list">
        {items.map((item) => (
          <div className="item" key={item.id}>
            <div className="item-name">{item.name}</div>
            <div className="item-price">{item.price}</div>
          </div>
        ))}
      </div>
    );
  };

  
  

 

  const CardsList = ({ recommendations,selectedCartIndex,setSelectedCartIndex,setShowCartAdd,setShowCartDrop  }) => {
    const handleSelectCart = (index) => {
        // setSelectedCartIndex((prevIndex) => (prevIndex === index ? null : index));
        setSelectedCartIndex((prevIndex) => {
            // If the previous index is the same as the new index, set it to null and hide the drop
            if (prevIndex === index) {
                setShowCartAdd(false);
              setShowCartDrop(true);
              return null;
            }
        
            // If the previous index is not the same as the new index, set the new index and show the add
            setShowCartDrop(false);
            setShowCartAdd(true);
            return index;
          });

        console.log("index",selectedCartIndex)
      };
    return (
      <>
        {recommendations.map((recommendation, index) => (
           <Grid item xs={4}>
           <Item className="card">
           <Typography variant="h5" className="storeName">{recommendation.Store}</Typography>
              <Typography variant="h7" className="deliveryType">{recommendation.Service}</Typography>
                <div className="item-head">
                   <div className="item-name">Total Cost</div>
                   <div className="item-price">{recommendation.TotalCost}</div>
                 </div>
                 <div className="item-sub-head">
                   <div className="item-name">Cart Cost</div>
                   <div className="item-price">{recommendation.CartCost}</div>
                 </div>
                 <div className="item-sub-head">
                   <div className="item-name">Service Cost</div>
                   <div className="item-price">{recommendation.ServiceCost}</div>
                 </div>
                 <div className="item-head">
                   <div className="item-name">Total Time</div>
                   <div className="item-price">{recommendation.TotalTime}</div>
                 </div>
               <Card className="innerCard">           
                     <CardContent>
                       <Accordion>
                         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                           <Typography>Cart Total:<span className="total-price">{recommendation.CartCost}</span></Typography>
                         </AccordionSummary>
                         <AccordionDetails>
                            <ItemsList items={recommendation.Items}/>
                         </AccordionDetails>
                       </Accordion>
                       <Accordion>
                         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                           <Typography>Total Time:<span className="total-price">{recommendation.TotalTime}</span></Typography>
                         </AccordionSummary>
                         <AccordionDetails>
                         <div className="items-list">
                         <div className="item">
                         <div className="item-name">Purchase Time: </div>
                         <div className="item-price">{recommendation.Time[0]}</div>
                          </div>
                          <div className="item">
                         <div className="item-name">Service Time: </div>
                         <div className="item-price">{recommendation.Time[1]}</div>
                          </div>
                          </div>
                         </AccordionDetails>
                       </Accordion>
                       
                       {/* Add more Accordions as needed */}
                     </CardContent>
               </Card>
               <p><button onClick={() => handleSelectCart(index)}>Select Cart</button></p>      
           </Item>
         </Grid>
        ))}
      </>
    );
  };



const RecommendationModal = ({ open, handleClose, recommendations,checkoutHandler,showAlert,setShowAlert}) => {
    const [selectedCartIndex, setSelectedCartIndex] = useState(null);
    const [showCartAdd, setShowCartAdd] = useState(null);
    const [showCartDrop, setShowCartDrop] = useState(null);
  return (
    <Modal open={open} onClose={handleClose}>
      <Paper className="modalPaper">
        <div className="modalHeader">
          <Typography variant="h5">Recommendations</Typography>
          <CloseIcon onClick={handleClose} className="closeIcon" />
        </div>
        <div className="modalCards">
        <Grid container spacing={2}>
         <CardsList recommendations={recommendations} selectedCartIndex={selectedCartIndex} setSelectedCartIndex={setSelectedCartIndex} setShowCartAdd={setShowCartAdd} setShowCartDrop={setShowCartDrop}/>
        </Grid>
        <Stack sx={{ width: '100%' }} spacing={2}>
        {showAlert && (
        <Alert variant="outlined" severity="error" onClose={() => setShowAlert(false)}>
          Please select a cart
        </Alert>
      )}
      {showCartAdd && (
        <Alert variant="outlined" severity="success" onClose={() => setShowCartAdd(false)}>
          Selected Cart {selectedCartIndex+0}
        </Alert>
      )}
      {showCartDrop && (
        <Alert variant="outlined" severity="error" onClose={() => setShowCartDrop(false)}>
          Droped Cart
        </Alert>
      )}
      </Stack>
          <div className="modalCheckoutBtn">
            <Button variant="contained" color="primary" onClick={()=>checkoutHandler(selectedCartIndex)} >
              Checkout
            </Button>
          </div>
        </div>
      </Paper>
    </Modal>
  );
};

export default RecommendationModal;
