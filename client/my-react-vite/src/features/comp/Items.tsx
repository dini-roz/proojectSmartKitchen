
import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import {
    Grid,
    Paper,
    Typography,
    styled,
    keyframes,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAppSelector } from '../../app/hooks/useAppSelector';
import { selectAllProducts, selectCurrentUserName, updateKitchenItems } from '../users/api/authSlice';

import { useDeleteItemMutation, useGetProductsQuery, useUpdateItemMutation, useUploadImageMutation } from "../item/itemApi ";
import { useAppDispatch } from '../../app/hooks/useAppDispatch';

const pulse = keyframes`
    0% {
        transform: scale(1);
        opacity: 0.9;
    }
    50% {
        transform: scale(1.03);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 0.9;
    }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: theme.shadows[2],
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    position: 'relative',
    '&:hover': {
        transform: 'scale(1.05)',
        animation: `${pulse} 1s infinite alternate`,
    },
}));

const ItemContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
});

const FixedSizeImage = styled('img')({
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '8px',
});

const ItemName = styled(Typography)({
    fontWeight: 'bold',
    color: '#333',
    marginTop: '8px',
});

const ItemDetail = styled(Typography)({
    fontSize: '0.8rem',
    color: '#666',
});

const DeleteButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: 'rgba(177, 168, 168, 0.7)',
    color: 'white',
    zIndex: 1,
    '&:hover': {
        backgroundColor: 'rgba(255, 0, 0, 0.9)',
    },
    [`${StyledPaper}:hover &`]: {
        opacity: 1,
    },
}));

const EditButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    backgroundColor: 'rgba(204, 217, 231, 0.7)',
    color: 'white',
    zIndex: 1,
    '&:hover': {
        backgroundColor: 'rgba(0, 123, 255, 0.9)',
    },
}));

const Items: React.FC = () => {
    const REACT_APP_SERVER_URL = `http://localhost:3001`;
    const products = useAppSelector(selectAllProducts);
    const userId = useAppSelector(selectCurrentUserName);
    const dispatch = useAppDispatch();

    const [triggerDeleteItem, { isLoading: isDeletingGlobal, error: deleteError }] = useDeleteItemMutation();
    const { data: productsData, refetch: refetchProducts } = useGetProductsQuery(`${userId}`);

    const [triggerUpdateItem, { isLoading: isUpdating, error: updateError }] = useUpdateItemMutation();
    const [triggerUploadImage, { isLoading: isUploadingImage, error: uploadError }] = useUploadImageMutation();

    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        productIdToDelete: string | null;
        productName: string;
    }>({
        open: false,
        productIdToDelete: null,
        productName: '',
    });

    const [dialog, setDialog] = useState<{
        open: boolean;
        title: string;
        message: string;
        type: 'success' | 'error';
    }>({
        open: false,
        title: '',
        message: '',
        type: 'success',
    });

    const [editDialog, setEditDialog] = useState<{
        open: boolean;
        productId: string | null;
        currentName: string;
        currentQuantity: number;
        currentImageUrl: string;
        currentCategory: string;
    }>({
        open: false,
        productId: null,
        currentName: '',
        currentQuantity: 0,
        currentImageUrl: '',
        currentCategory: '',
    });

    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

    const categories = ['ירקות', 'פירות', 'בשר', 'חלב', 'מאפים', 'משקאות', 'אחר'];

    const editDialogNameFieldRef = useRef<HTMLInputElement>(null);
    const lastFocusedEditButtonRef = useRef<HTMLButtonElement>(null);


    useEffect(() => {
        if (productsData) {
            dispatch(updateKitchenItems(productsData));
        }
    }, [productsData, dispatch]);

    useEffect(() => {
        if (editDialog.open) {
            setTimeout(() => {
                if (editDialogNameFieldRef.current) {
                    editDialogNameFieldRef.current.focus();
                }
            }, 0);
        }
    }, [editDialog.open]);

    // **חדש: useEffect לטיפול בפוקוס לאחר סגירת דיאלוג הודעה**
    useEffect(() => {
        if (!dialog.open) { // כאשר דיאלוג ההודעה נסגר
            const timer = setTimeout(() => {
                if (lastFocusedEditButtonRef.current) {
                    lastFocusedEditButtonRef.current.focus();
                }
            }, 100); // השהייה קצרה של 100ms
            return () => clearTimeout(timer);
        }
    }, [dialog.open]);


    const handleCloseDialog = () => {
        setDialog(prev => ({ ...prev, open: false }));
        // הפוקוס יטופל ב-useEffect החדש
    };

    const handleDelete = async (productId: string, productName: string) => {
        if (!userId) {
            setDialog({
                open: true,
                title: 'שגיאה',
                message: 'User ID חסר. לא ניתן למחוק מוצר. אנא התחבר מחדש.',
                type: 'error',
            });
            return;
        }

        setConfirmDialog({
            open: true,
            productIdToDelete: productId,
            productName: productName,
        });
    };

    const handleConfirmDelete = async () => {
        if (!confirmDialog.productIdToDelete || !userId) {
            setDialog({
                open: true,
                title: 'שגיאה',
                message: 'נתוני מחיקה חסרים. אנא נסה שוב.',
                type: 'error',
            });
            setConfirmDialog({ ...confirmDialog, open: false });
            return;
        }

        setConfirmDialog({ ...confirmDialog, open: false });

        const productId = confirmDialog.productIdToDelete;
        setDeletingProductId(productId);

        try {
            await triggerDeleteItem({ userId, productId }).unwrap();
            setDialog({
                open: true,
                title: 'מחיקה בוצעה בהצלחה!',
                message: 'המוצר נמחק מהמטבח שלך.',
                type: 'success',
            });

            const updatedProductsData = await refetchProducts().unwrap();
            dispatch(updateKitchenItems(updatedProductsData));
        } catch (err) {
            console.error("נכשלה מחיקת מוצר:", err);
            const serverErrorMessage = (deleteError as any)?.data?.message || (err as any)?.message || 'שגיאה לא ידועה';
            setDialog({
                open: true,
                title: 'שגיאה במחיקה',
                message: `הפעולה נכשלה: ${serverErrorMessage}.`,
                type: 'error',
            });
        } finally {
            setDeletingProductId(null);
        }
    };

    const handleEditClick = (item: any, event: React.MouseEvent<HTMLButtonElement>) => {
        if (event.currentTarget) {
            lastFocusedEditButtonRef.current = event.currentTarget;
        }

        setEditDialog({
            open: true,
            productId: item._id,
            currentName: item.name,
            currentQuantity: item.quantity,
            currentImageUrl: item.imageUrl || '',
            currentCategory: item.category || '',
        });
        setSelectedImageFile(null);
    };

    const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImageFile(event.target.files[0]);
        } else {
            setSelectedImageFile(null);
        }
    };

    const handleUpdateItem = async () => {
        if (!userId || !editDialog.productId) {
            setDialog({ open: true, title: 'שגיאה', message: 'נתוני עדכון חסרים.', type: 'error' });
            return;
        }

        let newImageUrl = editDialog.currentImageUrl;

        if (selectedImageFile) {
            try {
                const formData = new FormData();
                formData.append('image', selectedImageFile);
                const uploadResult = await triggerUploadImage(formData).unwrap();
                newImageUrl = uploadResult.imageUrl;
            } catch (imageUploadError) {
                console.error('שגיאה בהעלאת תמונה:', imageUploadError);
                setDialog({
                    open: true,
                    title: 'שגיאה בהעלאת תמונה',
                    message: `נכשלה העלאת התמונה: ${(imageUploadError as any)?.data?.message || (imageUploadError as Error).message || 'שגיאה לא ידועה'}. הפריט יעודכן ללא תמונה חדשה זו.`,
                    type: 'error',
                });
                newImageUrl = editDialog.currentImageUrl;
            }
        }

        try {
            await triggerUpdateItem({
                userId,
                productId: editDialog.productId,
                name: editDialog.currentName,
                quantity: editDialog.currentQuantity,
                imageUrl: newImageUrl,
                category: editDialog.currentCategory,
            }).unwrap();

            setEditDialog({ ...editDialog, open: false });

            setDialog({
                open: true,
                title: 'עדכון בוצע בהצלחה!',
                message: `הפריט "${editDialog.currentName}" עודכן במטבח שלך.`,
                type: 'success',
            });

            const updatedProductsData = await refetchProducts().unwrap();
            dispatch(updateKitchenItems(updatedProductsData));
        } catch (err) {
            console.error("נכשלה עדכון מוצר:", err);
            const serverErrorMessage = (updateError as any)?.data?.message || (err as any)?.message || 'שגיאה לא ידועה';
            setDialog({
                open: true,
                title: 'שגיאה בעדכון',
                message: `הפעולה נכשלה: ${serverErrorMessage}.`,
                type: 'error',
            });
            setEditDialog({ ...editDialog, open: false });
        }
    };

    let content;

    if (!products || products.length === 0) {
        content = <Typography variant="h6" color="textSecondary" sx={{ mt: 5 }}>המטבח ריק כרגע. הוסף כמה מוצרים!</Typography>;
    } else {
        content = (
            <Grid
                container
                spacing={4}
                justifyContent="center"
            >
                {products.map((item: any) => {
                    const isCurrentItemDeleting = deletingProductId === item._id;
                    return (
                        <Grid  key={item._id}>
                            <StyledPaper>
                                <ItemContainer>
                                    {item.imageUrl && (
                                        <FixedSizeImage
                                            src={`${REACT_APP_SERVER_URL}${item.imageUrl}`}
                                            alt={item.name}
                                            onError={(e) => {
                                                console.error("שגיאה בטעינת תמונה:", item.imageUrl);
                                                (e.target as HTMLImageElement).onerror = null;
                                                (e.target as HTMLImageElement).src = '/fallbackImage.png';
                                            }}
                                        />
                                    )}
                                    <ItemName variant="h6">{item.name}</ItemName>
                                    <ItemDetail>כמות: {item.quantity}</ItemDetail>
                                    {item.category && <ItemDetail>קטגוריה: {item.category}</ItemDetail>}
                                </ItemContainer>
                                <EditButton
                                    aria-label="edit"
                                    onClick={(event) => handleEditClick(item, event)}
                                >
                                    <EditIcon />
                                </EditButton>
                                <DeleteButton
                                    aria-label="delete"
                                    onClick={() => handleDelete(item._id, item.name)}
                                    disabled={isCurrentItemDeleting || isDeletingGlobal}
                                >
                                    {isCurrentItemDeleting ? <CircularProgress size={24} color="inherit" /> : <DeleteIcon />}
                                </DeleteButton>
                            </StyledPaper>
                        </Grid>
                    );
                })}
            </Grid>
        );
    }

    return (
        <>
            {content}

            {/* דיאלוג אישור מחיקה */}
            <Dialog
                open={confirmDialog.open}
                onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title" sx={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {'אישור מחיקה'}
                </DialogTitle>
                <DialogContent sx={{ padding: '20px', minWidth: '300px' }}>
                    <Typography id="confirm-dialog-description" variant="body1">
                        האם אתה בטוח שברצונך למחוק את המוצר **{confirmDialog.productName}** מהמטבח שלך?
                        <br />פעולה זו הינה בלתי הפיכה.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around', padding: '10px 20px' }}>
                    <Button
                        onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
                        variant="outlined"
                        color="primary"
                    >
                        ביטול
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        autoFocus
                        variant="contained"
                        sx={{
                            backgroundColor: '#f44336',
                            '&:hover': {
                                backgroundColor: '#d32f2f',
                            }
                        }}>
                        מחק
                    </Button>
                </DialogActions>
            </Dialog>

            {/* דיאלוג הודעות הצלחה/שגיאה */}
            <Dialog
                open={dialog.open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{
                    backgroundColor: dialog.type === 'error' ? '#d32f2f' : '#2e7d32',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {dialog.title}
                </DialogTitle>
                <DialogContent sx={{ padding: '20px', minWidth: '300px' }}>
                    <Typography id="alert-dialog-description" variant="body1">
                        {dialog.message}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', padding: '10px 20px' }}>
                    <Button
                        onClick={handleCloseDialog}
                        autoFocus
                        variant="contained"
                        sx={{
                            backgroundColor: dialog.type === 'error' ? '#d32f2f' : '#2e7d32',
                            '&:hover': {
                                backgroundColor: dialog.type === 'error' ? '#b71c1c' : '#1b5e20',
                            }
                        }}>
                        סגור
                    </Button>
                </DialogActions>
            </Dialog>

            {/* דיאלוג עדכון פריט */}
            <Dialog
                open={editDialog.open}
                onClose={() => setEditDialog({ ...editDialog, open: false })}
                aria-labelledby="edit-dialog-title"
            >
                <DialogTitle id="edit-dialog-title" sx={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    {'עדכון פריט במטבח'}
                </DialogTitle>
                <DialogContent sx={{ padding: '20px', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <TextField
                        inputRef={editDialogNameFieldRef}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="שם הפריט"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editDialog.currentName}
                        onChange={(e) => setEditDialog({ ...editDialog, currentName: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        id="quantity"
                        label="כמות"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={editDialog.currentQuantity}
                        onChange={(e) => setEditDialog({ ...editDialog, currentQuantity: Number(e.target.value) })}
                    />

                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        עדכן תמונה (אופציונלי):
                    </Typography>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="raised-button-file"
                        type="file"
                        onChange={handleImageFileChange}
                    />
                    <label htmlFor="raised-button-file">
                        <Button variant="outlined" component="span" disabled={isUploadingImage}>
                            {selectedImageFile ? selectedImageFile.name : 'בחר קובץ תמונה'}
                            {isUploadingImage && <CircularProgress size={20} sx={{ ml: 1 }} />}
                        </Button>
                    </label>

                    {editDialog.currentImageUrl && !selectedImageFile && (
                        <img
                            src={`${REACT_APP_SERVER_URL}${editDialog.currentImageUrl}`}
                            alt="תמונה נוכחית"
                            style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px', borderRadius: '4px' }}
                        />
                    )}
                    {selectedImageFile && (
                        <img
                            src={URL.createObjectURL(selectedImageFile)}
                            alt="תמונה חדשה"
                            style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px', borderRadius: '4px' }}
                        />
                    )}

                    <FormControl fullWidth margin="dense" variant="standard">
                        <InputLabel id="category-label">קטגוריה</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            value={editDialog.currentCategory}
                            onChange={(e) => setEditDialog({ ...editDialog, currentCategory: e.target.value as string })}
                            label="קטגוריה"
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around', padding: '10px 20px' }}>
                    <Button
                        onClick={() => setEditDialog({ ...editDialog, open: false })}
                        variant="outlined"
                        color="error"
                    >
                        ביטול
                    </Button>
                    <Button
                        onClick={handleUpdateItem}
                        variant="contained"
                        color="success"
                        disabled={isUpdating || isUploadingImage}
                    >
                        {isUpdating || isUploadingImage ? <CircularProgress size={24} color="inherit" /> : 'שמור שינויים'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Items;
////////////////////////////////////////////////////////////


