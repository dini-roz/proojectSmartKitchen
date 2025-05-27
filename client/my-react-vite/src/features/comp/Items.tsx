
// import React from 'react';
// import { useGetProductsQuery } from '../item/itemApi '; // נתיב ל-itemApi שלך
// import { useParams } from 'react-router-dom';
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   Grid,
//   Paper,
//   styled,
//   keyframes,
//   useTheme, // ייבוא useTheme
// } from '@mui/material';
// import { nullable } from 'zod';
// import { useAppDispatch } from '../../app/hooks/useAppDispatch';
// import { useAppSelector } from '../../app/hooks/useAppSelector';
// import { selectCurrentUserName } from '../users/api/authSlice';

// // ... (אותם סטיילים כמו קודם)

// const pulse = keyframes`
//   0% {
//     transform: scale(1);
//     opacity: 0.9;
//   }
//   50% {
//     transform: scale(1.03);
//     opacity: 1;
//   }
//   100% {
//     transform: scale(1);
//     opacity: 0.9;
//   }
// `;

// const StyledPaper = styled(Paper)(() => ({ // הסרנו את ({ theme }) כאן
//   borderRadius: '16px',
//   overflow: 'hidden',
//   boxShadow: useTheme().shadows[5], // השתמשנו ב-useTheme() כאן
//   transition: 'transform 0.2s ease-in-out',
//   '&:hover': {
//     transform: 'scale(1.05)',
//     boxShadow: useTheme().shadows[10], // השתמשנו ב-useTheme() כאן
//     animation: `${pulse} 1s infinite alternate`,
//   },
// }));

// const StyledCardMedia = styled(CardMedia)({
//   height: 180,
// });

// const StyledCardContent = styled(CardContent)(() => ({ // הסרנו את ({ theme }) כאן
//   textAlign: 'center',
//   padding: useTheme().spacing(3), // השתמשנו ב-useTheme() כאן
//   backgroundColor: '#f8f8f8',
//   borderBottomLeftRadius: '16px',
//   borderBottomRightRadius: '16px',
// }));

// const ItemNameTypography = styled(Typography)({
//   fontWeight: 'bold',
//   marginBottom: '0.5rem',
//   color: '#333',
// });

// const QuantityTypography = styled(Typography)(() => ({ // הוספנו את זה כדי להשתמש ב-theme
//   color: useTheme().palette.text.secondary, // השתמשנו ב-useTheme() כאן
//   marginBottom: '0.25rem',
// }));

// const CategoryTypography = styled(Typography)(() => ({ // הוספנו את זה כדי להשתמש ב-theme
//   color: useTheme().palette.text.secondary, // השתמשנו ב-useTheme() כאן
//   fontSize: '0.8rem',
// }));

// const Items: React.FC = () => {
//    // הגדרנו ש-homePageid יכול להיות אופציונלי
//        const formModee = useAppSelector(selectCurrentUserName);

//   const { data: items, isLoading, isError, error } = useGetProductsQuery(`${formModee}`);

//   if (isLoading) return <div>טוען מוצרים...</div>;
//   if (isError) 
//     return <div>אירעה שגיאה בטעינת המוצרים: {JSON.stringify(error)}</div>;
//    if (isError) {
    
//   }
//   if (!items || items.length === 0) return <div>המטבח ריק כרגע.</div>;

//   return (
//     <Grid container spacing={4}>
//       {items.map((item) => (
//         <Grid  key={item._id}>
//           <StyledPaper>
//             {item.imageUrl && (
//               <StyledCardMedia
              
//                 image={item.imageUrl}
             
//               />
//             )}
//             <StyledCardContent>
//               <ItemNameTypography >
//                 {item.name}
//               </ItemNameTypography>
//               <QuantityTypography variant="body2">
//                 כמות: {item.quantity}
//               </QuantityTypography>
//               {item.category && (
//                 <CategoryTypography variant="caption">
//                   קטגוריה: {item.category}
//                 </CategoryTypography>
//               )}
//             </StyledCardContent>
//           </StyledPaper>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default Items;
// import React from 'react';
// import { useGetProductsQuery } from '../item/itemApi ';
// import { useParams } from 'react-router';
// import {
//     Card,
//     CardMedia,
//     CardContent,
//     Typography,
//     Grid,
//     Paper,
//     styled,
//     keyframes,
//     useTheme,
// } from '@mui/material';
// import { useAppSelector } from '../../app/hooks/useAppSelector';
// import { selectCurrentUserName } from '../users/api/authSlice';

// const pulse = keyframes`
//     0% {
//         transform: scale(1);
//         opacity: 0.9;
//     }
//     50% {
//         transform: scale(1.03);
//         opacity: 1;
//     }
//     100% {
//         transform: scale(1);
//         opacity: 0.9;
//     }
// `;

// const lightColors = [
//     '#e0f7fa', // Cyan Light
//     '#f1f8e9', // Green Light
//     '#ffe0b2', // Amber Light
//     '#fbe9e7', // Red Light
//     '#ede7f6', // Purple Light
//     '#e3f2fd', // Blue Light
// ];

// const StyledPaper = styled(Paper)(({ index }) => ({
//     borderRadius: '12px',
//     overflow: 'hidden',
//     boxShadow: useTheme().shadows[3],
//     transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
//     backgroundColor: lightColors[index % lightColors.length], // רקע צבעוני מתחלף
//     '&:hover': {
//         transform: 'scale(1.05)',
//         boxShadow: useTheme().shadows[8],
//         animation: `${pulse} 1s infinite alternate`,
//     },
// }));

// const StyledCardMedia = styled(CardMedia)({
//     height: 140,
// });

// const StyledCardContent = styled(CardContent)(() => ({
//     textAlign: 'center',
//     padding: useTheme().spacing(2),
// }));

// const ItemNameTypography = styled(Typography)({
//     fontWeight: 'bold',
//     marginBottom: '0.3rem',
//     color: '#333',
//     fontSize: '1rem',
// });

// const QuantityTypography = styled(Typography)(() => ({
//     color: useTheme().palette.text.secondary,
//     marginBottom: '0.15rem',
//     fontSize: '0.85rem',
// }));

// const CategoryTypography = styled(Typography)(() => ({
//     color: useTheme().palette.text.secondary,
//     fontSize: '0.7rem',
// }));

// const Items: React.FC = () => {
//     const formModee = useAppSelector(selectCurrentUserName);
//     const { data: items, isLoading, isError, error } = useGetProductsQuery(`${formModee}`);

//     // if (isLoading) return <div>טוען מוצרים...</div>;
//     // if (isError) return <div>אירעה שגיאה בטעינת המוצרים: {JSON.stringify(error)}</div>;
//      if (!items || items.length === 0) return <div>המטבח ריק כרגע.</div>;

//     return (
//         <Grid container spacing={4} justifyContent="center" style={{ padding: useTheme().spacing(4) }}>
//             {items.map((item, index) => (
//                 <Grid key={item._id}>
//                     <StyledPaper index={index}>
//                         {item.imageUrl && (
//                             <StyledCardMedia
//                                 image={item.imageUrl}
//                                 title={item.name}
//                             />
//                         )}
//                         <StyledCardContent>
//                             <ItemNameTypography variant="h6" component="div">
//                                 {item.name}
//                             </ItemNameTypography>
//                             <QuantityTypography variant="body2">
//                                 כמות: {item.quantity}
//                             </QuantityTypography>
//                             {item.category && (
//                                 <CategoryTypography variant="caption">
//                                     קטגוריה: {item.category}
//                                 </CategoryTypography>
//                             )}
//                         </StyledCardContent>
//                     </StyledPaper>
//                 </Grid>
//             ))}
//         </Grid>
//     );
// };

// export default Items;
import React from 'react';
import { useGetProductsQuery } from '../item/itemApi ';
import { useParams } from 'react-router';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    Paper,
    styled,
    keyframes,
    useTheme,
} from '@mui/material';
import { useAppSelector } from '../../app/hooks/useAppSelector';
import { selectCurrentUserName } from '../users/api/authSlice';

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

const lightColors = [
    '#e0f7fa', // Cyan Light
    '#f1f8e9', // Green Light
    '#ffe0b2', // Amber Light
    '#fbe9e7', // Red Light
    '#ede7f6', // Purple Light
    '#e3f2fd', // Blue Light
];

const StyledPaper = styled(Paper)(({ index }) => ({
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: useTheme().shadows[3],
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    backgroundColor: lightColors[index % lightColors.length], // רקע צבעוני מתחלף
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: useTheme().shadows[8],
        animation: `${pulse} 1s infinite alternate`,
    },
}));

const StyledCardMedia = styled(CardMedia)({
    height: 140,
});

const StyledCardContent = styled(CardContent)(() => ({
    textAlign: 'center',
    padding: useTheme().spacing(2),
}));

const ItemNameTypography = styled(Typography)({
    fontWeight: 'bold',
    marginBottom: '0.3rem',
    color: '#333',
    fontSize: '1rem',
});

const QuantityTypography = styled(Typography)(() => ({
    color: useTheme().palette.text.secondary,
    marginBottom: '0.15rem',
    fontSize: '0.85rem',
}));

const CategoryTypography = styled(Typography)(() => ({
    color: useTheme().palette.text.secondary,
    fontSize: '0.7rem',
}));

const Items: React.FC = () => {
    const formModee = useAppSelector(selectCurrentUserName);
    const { data: items, isLoading, isError, error } = useGetProductsQuery(`${formModee}`);
    const theme = useTheme();

    let content;

    if (isLoading) {
        content = <div>טוען מוצרים...</div>;
    } else if (isError) {
        content = <div>אירעה שגיאה בטעינת המוצרים: {JSON.stringify(error)}</div>;
    } else if (!items || items.length === 0) {
        content = <div>המטבח ריק כרגע.</div>;
    } else {
        content = (
            <Grid container spacing={4} justifyContent="center" style={{ padding: theme.spacing(4) }}>
                {items.map((item, index) => (
                    <Grid key={item._id}>
                        <StyledPaper index={index}>
                            {item.imageUrl && (
                                <StyledCardMedia
                                    image={item.imageUrl}
                                    title={item.name}
                                />
                            )}
                            <StyledCardContent>
                                <ItemNameTypography variant="h6" component="div">
                                    {item.name}
                                </ItemNameTypography>
                                <QuantityTypography variant="body2">
                                    כמות: {item.quantity}
                                </QuantityTypography>
                                {item.category && (
                                    <CategoryTypography variant="caption">
                                        קטגוריה: {item.category}
                                    </CategoryTypography>
                                )}
                            </StyledCardContent>
                        </StyledPaper>
                    </Grid>
                ))}
            </Grid>
        );
    }

    return <>{content}</>;
};

export default Items;