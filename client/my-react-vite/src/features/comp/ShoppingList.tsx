
import React from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Divider,
    styled,
    IconButton,
    CircularProgress, // ייבוא עבור טעינה
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmailIcon from '@mui/icons-material/Email';
import DoneAllIcon from '@mui/icons-material/DoneAll'; // אייקון חדש
import { useAppSelector } from '../../app/hooks/useAppSelector';
import { selectCurrentUserName, selectShoppingList, updeteShopingliste } from '../users/api/authSlice';
import { useAddPurchasedItemMutation, useDeleteShoppingListItemMutation, useGetShoppingListQuery,  } from '../item/itemApi '; // ייבוא ה-mutation החדש
import { useAppDispatch } from '../../app/hooks/useAppDispatch';

// --- סטיילינג (ללא שינוי) ---
const CenteredContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // שינוי ל-flex-start כדי שהתוכן יתחיל מלמעלה
    minHeight: '100vh',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: theme.shadows[3],
    padding: theme.spacing(3),
    marginTop: theme.spacing(4),
    backgroundColor: '#f9f9f9',
    direction: 'rtl',
    margin: '0 auto',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none',
    },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const QuantityText = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    marginLeft: theme.spacing(1),
}));

const ShoppingListItems: React.FC = () => {
    const shoppingList = useAppSelector(selectShoppingList);
    const userid = useAppSelector(selectCurrentUserName);
    const [deleteShoppingListItem, { isLoading: isDeleting }] = useDeleteShoppingListItemMutation();
    const [addPurchasedItem, { isLoading: isAddingPurchased }] = useAddPurchasedItemMutation(); // ה-mutation החדש
    const { data: shopingg, refetch: refetchShoping } = useGetShoppingListQuery(`${userid}`);
    const dispatch = useAppDispatch();

    const handleSendEmail = () => {
        if (!shoppingList || shoppingList.length === 0) {
            alert('רשימת הקניות ריקה, אין מה לשלוח!');
            return;
        }

        const subject = encodeURIComponent('רשימת הקניות שלי');
        let body = 'שלום,\n\nהנה רשימת הקניות שלי:\n\n';

        shoppingList.forEach((item: any, index: number) => {
            body += `${index + 1}. ${item.name} - כמות: ${item.quantity}\n`;
        });

        body += '\nבברכה,\n[השם שלך]';
        const encodedBody = encodeURIComponent(body);

        window.location.href = `mailto:?subject=${subject}&body=${encodedBody}`;
    };

    const handleDeleteItem = async (itemIdToDelete: string) => {
        if (!userid) {
            alert('משתמש לא מזוהה, לא ניתן למחוק פריט.');
            return;
        }
        if (window.confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
            try {
                await deleteShoppingListItem({ userId: userid, itemId: itemIdToDelete }).unwrap();
                const updatedProductsData = await refetchShoping().unwrap();
                dispatch(updeteShopingliste(updatedProductsData));
            } catch (err) {
                console.error("Failed to delete shopping list item:", err);
                alert("אירעה שגיאה במחיקת הפריט.");
            }
        }
    };

    const handleMarkAsPurchased = async () => {
        if (!userid) {
            alert('משתמש לא מזוהה, לא ניתן לבצע פעולה זו.');
            return;
        }

        if (!shoppingList || shoppingList.length === 0) {
            alert('רשימת הקניות ריקה, אין מוצרים לרכוש!');
            return;
        }

        if (window.confirm('האם אתה בטוח שרכשת את כל הפריטים ברשימה?')) {
            try {
                for (const item of shoppingList) {
                    // 1. הוספת המוצר לרשימת המוצרים שנרכשו
                    await addPurchasedItem({
                        userId: userid,
                        name: item.name,
                        quantity: item.quantity
                    }).unwrap();

               
                   await deleteShoppingListItem({ userId: userid, itemId: item._id }).unwrap();
                }

                // 3. רענון רשימת הקניות לאחר הסיום
                const updatedShoppingData = await refetchShoping().unwrap();
                dispatch(updeteShopingliste(updatedShoppingData));
                alert('כל הפריטים סומנו כנרכשו והועברו בהצלחה!');
            } catch (err) {
                console.error("Failed to mark items as purchased:", err);
                alert("אירעה שגיאה בעת סימון הפריטים כנרכשו. ייתכן שחלקם לא הועברו או נמחקו.");
            }
        }
    };

    let content;
    // console.log(shoppingList); // נשאיר את זה לבדיקה כללית של הרשימה

    if (!shoppingList || shoppingList.length === 0) {
        content = (
            <Typography variant="h6" color="textSecondary" sx={{ mt: 5, textAlign: 'center' }}>
                רשימת הקניות ריקה כרגע. הוסף פריטים!
            </Typography>
        );
    } else {
        content = (
            <Box sx={{ width: '100%' }}>
                <List disablePadding>
                    {shoppingList.map((item: any, index: number) => {
                        // זה המקום לבדוק את ה-ID של כל פריט
                        // console.log(`פריט ברשימה (אינדקס ${index}):`, item);
                        // console.log(`_id של פריט באינדקס ${index}:`, item._id);

                        return (
                            <React.Fragment key={item._id || index}>
                                <StyledListItem>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ListItemIcon sx={{ minWidth: '40px', mr: 2, ml: 0 }}>
                                            <CheckCircleOutlineIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="h6" component="span">
                                                    {item.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box sx={{ display: 'flex', alignItems: 'center' }} component="div">
                                                    <Typography variant="body1" component="span">
                                                        כמות:
                                                    </Typography>
                                                    <QuantityText variant="body1">
                                                        {item.quantity}
                                                    </QuantityText>
                                                </Box>
                                            }
                                            sx={{ flexGrow: 1 }}
                                            primaryTypographyProps={{ component: 'span' }}
                                            secondaryTypographyProps={{ component: 'span' }}
                                        />
                                    </Box>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDeleteItem(item._id)}
                                        disabled={isDeleting}
                                        sx={{ ml: 2 }}
                                    >
                                        {isDeleting ? <CircularProgress size={24} /> : <DeleteIcon color="error" />}
                                    </IconButton>
                                </StyledListItem>
                                {index < shoppingList.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        );
                    })}
                </List>
                <Box sx={{ mt: 3, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EmailIcon />}
                        onClick={handleSendEmail}
                        sx={{ padding: '10px 20px', borderRadius: '8px' }}
                    >
                        שלח רשימה למייל
                    </Button>
                    <Button
                        variant="contained"
                        color="success" // צבע ירוק לכפתור "קניתי"
                        startIcon={<DoneAllIcon />}
                        onClick={handleMarkAsPurchased}
                        disabled={isAddingPurchased || isDeleting || shoppingList.length === 0} // מנוטרל בזמן פעולה או אם הרשימה ריקה
                        sx={{ padding: '10px 20px', borderRadius: '8px' }}
                    >
                        {isAddingPurchased ? <CircularProgress size={24} color="inherit" /> : 'קניתי את המוצרים'}
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <CenteredContainer maxWidth="sm">
            <StyledPaper>
                <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', color: '#424242' }}>
                    רשימת הקניות שלי
                </Typography>
                {content}
            </StyledPaper>
        </CenteredContainer>
    );
};

export default ShoppingListItems;