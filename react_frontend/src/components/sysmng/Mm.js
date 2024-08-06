import * as React from 'react';
import clsx from 'clsx';
import { animated, useSpring } from '@react-spring/web';
import { styled, alpha } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ArticleIcon from '@mui/icons-material/Article';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderRounded from '@mui/icons-material/FolderRounded';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { unstable_useTreeItem2 as useTreeItem2 } from '@mui/x-tree-view/useTreeItem2';
import {
    TreeItem2Checkbox,
    TreeItem2Content,
    TreeItem2IconContainer,
    TreeItem2Label,
    TreeItem2Root,
} from '@mui/x-tree-view/TreeItem2';
import { TreeItem2Icon } from '@mui/x-tree-view/TreeItem2Icon';
import { TreeItem2Provider } from '@mui/x-tree-view/TreeItem2Provider';
import { TreeItem2DragAndDropOverlay } from '@mui/x-tree-view/TreeItem2DragAndDropOverlay';
import { AllButton } from '../../Button';
import { useState } from 'react';
import Paper from '@mui/material/Paper';

function DotIcon() {
    return (
        <Box
            sx={{
                width: 6,
                height: 6,
                borderRadius: '70%',
                bgcolor: 'warning.main',
                display: 'inline-block',
                verticalAlign: 'middle',
                zIndex: 1,
                mx: 1,
            }}
        />
    );
}

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
    color:
    theme.palette.mode === 'light'
        ? theme.palette.grey[800]
        : theme.palette.grey[400],
    position: 'relative',
    [`& .${treeItemClasses.groupTransition}`]: {
        marginLeft: theme.spacing(3.5),
    },
}));

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
    flexDirection: 'row-reverse',
    borderRadius: theme.spacing(0.7),
    marginBottom: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    paddingRight: theme.spacing(1),
    fontWeight: 500,
    [`&.Mui-expanded `]: {
        '&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon': {
    color:
        theme.palette.mode === 'light'
            ? theme.palette.primary.main
            : theme.palette.primary.dark,
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: '16px',
        top: '44px',
        height: 'calc(100% - 48px)',
        width: '1.5px',
        backgroundColor:
        theme.palette.mode === 'light'
            ? theme.palette.grey[300]
            : theme.palette.grey[700],
        },
    },
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.mode === 'light' ? theme.palette.primary.main : 'white',
    },
    [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
    backgroundColor:
        theme.palette.mode === 'light'
            ? theme.palette.primary.main
            : theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
    },
}));
const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props) {
    const style = useSpring({
        to: {
            opacity: props.in ? 1 : 0,
            transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
        },
    });

    return <AnimatedCollapse style={style} {...props} />;
}

const StyledTreeItemLabelText = styled(Typography)({
    color: 'inherit',
    // fontFamily: 'General Sans',
    fontWeight: 500,
});

function CustomLabel({ icon: Icon, expandable, children, ...other }) {
    return (
        <TreeItem2Label
            {...other}
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
        {Icon && (
            <Box
                component={Icon}
                className="labelIcon"
                color="inherit"
                sx={{ mr: 1, fontSize: '1.2rem' }}
            />
        )}

        <StyledTreeItemLabelText variant="body2">{children}</StyledTreeItemLabelText>
        {expandable && <DotIcon />}
        </TreeItem2Label>
    );
}

const convertMenusToTreeItems = (menus) => {
    console.log(menus);
    const traverse = (nodes, parentId = null) => {
        if (!nodes) return [];

        return nodes.map((node, index) => {
            const id = parentId ? `${parentId}.${index + 1}` : `${index + 1}`;
            const treeItem = {
                id,
                label: node.name,
                children: traverse(node.menu, id),
            };
            if (node.url) {
                treeItem.fileType = 'doc'; // or any other type you want to use
                treeItem.url = node.url;
            }
            return treeItem;
        });
    };

    const rootItem = {
        id: '0',
        label: 'root',
        children: traverse(menus),
    };

    return [rootItem];
};

const isExpandable = (reactChildren) => {
    if (Array.isArray(reactChildren)) {
        return reactChildren.length > 0 && reactChildren.some(isExpandable);
    }
    return Boolean(reactChildren);
};

const getIconFromFileType = (fileType) => {
    switch (fileType) {
        case 'doc':
            return ArticleIcon;
        case 'folder':
            return FolderRounded;
        case 'pinned':
            return FolderOpenIcon;
        default:
            return ArticleIcon;
    }
};

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
    const { id, itemId, label, disabled, children, ...other } = props;

    const {
        getRootProps,
        getContentProps,
        getIconContainerProps,
        getCheckboxProps,
        getLabelProps,
        getGroupTransitionProps,
        getDragAndDropOverlayProps,
        status,
        publicAPI,
    } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

    const item = publicAPI.getItem(itemId);
    const expandable = isExpandable(children);
    let icon;
    if (expandable) {
        icon = FolderRounded;
    } else if (item.fileType) {
        icon = getIconFromFileType(item.fileType);
    }

    return (
        <TreeItem2Provider itemId={itemId}>
            <StyledTreeItemRoot {...getRootProps(other)}>
                <CustomTreeItemContent
                    {...getContentProps({
                        className: clsx('content', {
                        'Mui-expanded': status.expanded,
                        'Mui-selected': status.selected,
                        'Mui-focused': status.focused,
                        'Mui-disabled': status.disabled,
                    }),
                })}
                >
                <TreeItem2IconContainer {...getIconContainerProps()}>
                    <TreeItem2Icon status={status} />
                </TreeItem2IconContainer>
                <TreeItem2Checkbox {...getCheckboxProps()} />
                <CustomLabel
                    {...getLabelProps({ icon, expandable: expandable && status.expanded })}
                />
                <TreeItem2DragAndDropOverlay {...getDragAndDropOverlayProps()} />
                </CustomTreeItemContent>
                {children && <TransitionComponent {...getGroupTransitionProps()} />}
            </StyledTreeItemRoot>
        </TreeItem2Provider>
    );
});

export default function Mm({menus}) {
    const items = convertMenusToTreeItems(menus);
    
    // 수정해야함
    const [showtable, setShowTable] = useState(showtable ? true : false);

    const clickMenuHandler = () => {
        setShowTable(!showtable);
    }

    return (
        <>
            <div>
                {"홈 > 시스템관리 > 메뉴 관리"}
            </div>
            <AllButton/>
            <RichTreeView
            items={items}
            defaultExpandedItems={['1', '1.1']}
            defaultSelectedItems="1.1"
            sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            slots={{ item: CustomTreeItem }}
            onItemClick={() => clickMenuHandler()}
            />
            <div>
                {"권한 부여 현황"}
            </div>
            {showtable ? (
                /** 테이블 컴포넌트 하나 생성해서 할당 */
                <Paper elevation={6} style={{width:"1000px", height:"1000px"}}>
                    <div style={{width: "120px", height: "1000px", backgroundColor:"red"}}></div>
                </Paper>
            ) : <></>}
        </>
    );
}