import * as React from 'react';
import clsx from 'clsx';
import { animated, useSpring } from '@react-spring/web';
import { styled, alpha, createTheme } from '@mui/material/styles';
import * as sysStyles from '../../assets/css/sysmng.css'

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
import { ButtonGroup, ButtonGroupMm } from '../../Button';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import { Button, Card, TextField } from '@mui/material';
import TableCustom from '../../TableCustom';
import { table_mm } from '../../assets/json/selectedPjt';
import * as mainStyle from '../../assets/css/main.css';
import { Select } from 'antd';
import axiosInstance from '../../utils/AxiosInstance';

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

const convertMenusToTreeItems = (menus) => {
    const traverse = (nodes, parentId = null) => {
        if (!nodes) return [];

        return nodes.map((node, index) => {
            const id = parentId ? `${parentId}.${index + 1}` : `${index + 1}`;
            const treeItem = {
                id,
                originId: node.id,
                menuOrder: node.menuOrder,
                label: node.name,
                accessUser: node.accessUser, 
                children: traverse(node.menu, id),
            };
            if (node.url) {
                treeItem.fileType = 'doc'; 
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
    const findParentFolder = (id, menus) => {
        if (id.length === 1) {
            if(id === 0) {return null}
            else {
                const parentId = findMenuItemById('0', menus)
                return parentId;
            }
        }
        const parentId = id.slice(0, id.lastIndexOf('.'));
        return parentId ? findMenuItemById(parentId, menus) : null;
    };
    const findMenuItemById = (id, menus) => {
        for (const node of menus) {
            if (node.id === id) {
                return node;

            }
            if (node.children) {
                const found = findMenuItemById(id, node.children);
                if (found) return found;
            }
        }
        return null;
    };

    const items = convertMenusToTreeItems(menus);
    // 수정해야함
    const [showtable, setShowTable] = useState(false);

    const [selectedMenu, setSelectedMenu] = useState({
        item: '',
        originId: '',
        name: '',
        parentDir: '',
        parentDirId: '',
        menuOrder: '',
        accessUser: '',
        url: '',
    });

    const clickMenuHandler = (e, item) => {
        setShowTable(true);
        setEditable(true);
        const clickedItem = findMenuItemById(item, items); // items는 전체 메뉴 트리입니다.
        if (clickedItem) {
            // 상위 폴더 찾기
            const parrentDir = findParentFolder(item, items);
            const newMenuInfo = {
                id: item,
                originId: clickedItem.originId,
                name: clickedItem.label, // 메뉴 이름
                parentDir: parrentDir ? parrentDir.label : '상위 폴더 없음', // 상위 폴더 이름
                parentDirId: parrentDir ? parrentDir.originId : 0,
                menuOrder: clickedItem.menuOrder,
                accessUser: clickedItem.accessUser, // 접근 권한 (필요 시 다른 값을 설정)
                url: clickedItem.url,
            };
            setSelectedMenu(newMenuInfo); // 상태 업데이트
        }
    };

    // 모달 구현부
    const [isModalOpen, setIsModalOpen] = useState({
        MmAdd: false,
        Delete: false
    });
    const showModal = (modalType) => {
        setIsModalOpen(prevState => ({...prevState, [modalType]: true}));
    };

    // 담당자 지정 등록 버튼 클릭 시 호출될 함수
    const handleOk = (modalType) => (data) => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    };

    const handleCancel = (modalType) => () => {
        setIsModalOpen(prevState => ({ ...prevState, [modalType]: false }));
    }; 

    const handleAddClick = () => {
        showModal('MmAdd');
    }

    const handleDeleteClick = () => {
        showModal('Delete');
    }
    const handleEditClick = () => {
        setEditable(false);
        (async () => {
            const {data} = await axiosInstance.get(`/sys/menu/cand?id=${selectedMenu.originId}`);
            setUpperDir(data);
        })();
    }
    
    const [editable, setEditable] = useState(true);
    const [upperDir, setUpperDir] = useState([]);

    const [menuName, setMenuName] = useState('');
    const [url, setUrl] = useState('');
    const [accessUser, setAccessUser] = useState('');
    const [menuOrder, setMenuOrder] = useState('');
    const [selectedUpperDir, setSelectedUpperDir] = useState(null);
    const handleSaveClick = async () => {
        setEditable(!editable);
        

        const formData = {
            id: selectedMenu.originId,
            menuName: selectedMenu.name,
            rootId: selectedMenu.parentDirId === undefined ? 1 : selectedMenu.parentDirId,
            address: selectedMenu.url,
            accessUser: selectedMenu.accessUser,
            menuOrder: selectedMenu.menuOrder
        }
        try {
            const {data} = await axiosInstance.patch('/sys/menu', formData);
            // handleOk을 호출하여 모달을 닫고 상위 컴포넌트에 알림
            // setUserList(prevList => prevList.map(user => 
            //     user.id === data.id ? data : user
            // ));
            setSelectedMenu(data);
            
        } catch (error) {
            console.error(error);
        }

    };


    const access = [
        {
            value: 'FP',
            label: '현장담당자'
        },
        {
            value: 'HP',
            label: '본사담당자'
        },
        {
            value: 'ADMIN',
            label: '시스템관리자'
        },
    ]
    
    let res = [];
    function parseMenu(menuArray, bd = null, md = null) {
        menuArray.forEach(item => {
            if (item.level === 1) {
                parseMenu(item.menu, item.name, null);
            } else if (item.level === 2) {
                if (item.menu && item.menu.length > 0) {
                parseMenu(item.menu, bd, item.name);
                } else {
                res.push({ id: item.id, level: item.level, url: item.url, name: item.name, accessUser: item.accessUser, bd, md: item.name, sd: null });
                }
            } else if (item.level === 3) {
                res.push({ id: item.id, level: item.level, url: item.url, name: item.name, accessUser: item.accessUser, bd, md, sd: item.name });
            }
        });
    }

    const handleInputChange = (field, value) => {
        setSelectedMenu(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    menus.forEach(menu => parseMenu(menu.menu, menu.name, null));
    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"시스템관리 > 메뉴 관리"}
            </div>
            <div className={sysStyles.main_grid}>
                <Card sx={{width:"24%", borderRadius:"15px"}}>
                <TableCustom title='' className={sysStyles.btn_group} buttons={['Add', 'Delete', 'Edit']} 
                onClicks={[handleAddClick,handleDeleteClick, handleEditClick]} 
                table={false} 
                selectedRows={[selectedMenu]}
                modals={[
                    {
                        "modalType" : 'MmAdd',
                        'isModalOpen': isModalOpen.MmAdd,
                        'handleOk': handleOk('MmAdd'),
                        'handleCancel': handleCancel('MmAdd'),
                        'rowData': selectedMenu,
                    },
                    {
                        "modalType" : 'Delete',
                        'isModalOpen': isModalOpen.Delete,
                        'handleOk': handleOk('Delete'),
                        'handleCancel': handleCancel('Delete'),
                        'rowData': selectedMenu,
                        'rowDataName': "name",
                        'url': '/sys/menu',
                    },
                ]}/>
                <RichTreeView
                items={items}
                sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'auto', width:"100%"}}
                slots={{ item: CustomTreeItem }}
                onItemClick={(e, item) => {clickMenuHandler(e, item);}}
                />
                </Card>
                {showtable ? (
                    /** 테이블 컴포넌트 하나 생성해서 할당 */
                    /** 권한 부여 현황 어케 할건지 및 등록, 수정화면 필요 */
                    <>
                    <Card className={sysStyles.card_box} sx={{width:"38%", borderRadius:"15px"}}>
                        <div className={sysStyles.mid_title}>{"메뉴 정보"}</div>
                        <div className={sysStyles.text_field} style={{marginTop:"2rem"}}>
                            <div className={sysStyles.text}>
                                {"메뉴 이름"}
                            </div>
                            {!editable ? (
                                <TextField id='menuName' disabled={editable} onChange={(e) => handleInputChange('name', e.target.value)} value={selectedMenu.name} variant='outlined' sx={{width:"20rem"}}/>
                            ) : (
                                <TextField id='menuName' disabled={editable} onChange={handleInputChange} value={selectedMenu.name} variant='outlined' sx={{width:"20rem", backgroundColor:"rgb(223,223,223)"}}/>
                            )}
                            
                        </div>
                        <div className={sysStyles.text_field}>
                            <div className={sysStyles.text}>{"상위 폴더"}</div>
                            {!editable ? (
                                <Select value={selectedMenu.parentDir} onChange={(e) => handleInputChange('parentDirId', e)} style={{width:"20rem", height:"3.5rem", fontSize:"4rem"}}>
                                {upperDir.map(option => (
                                    <Select.Option key={option.id} value={option.id}>
                                        {option.name}
                                    </Select.Option>
                                ))}
                                </Select>
                            ) : (
                            <TextField id='parentDir' disabled={editable} variant='outlined' value={selectedMenu.parentDir} sx={{width:"20rem", backgroundColor:"rgb(223,223,223)"}}/>
                            )}
                            
                        </div>
                        <div className={sysStyles.text_field}>
                            <div className={sysStyles.text}>{"Url 주소"}</div>
                            {!editable ? (
                                <TextField id='address' defaultValue={selectedMenu.url} disabled={editable} variant='outlined' onChange={(e) => handleInputChange('url', e.target.value)} value={selectedMenu.url} sx={{width:"20rem"}}/>
                            ) : (
                            <TextField id='address' disabled={editable} variant='outlined' value={selectedMenu.url} sx={{width:"20rem", backgroundColor:"rgb(223,223,223)"}}/>
                            )}
                            
                        </div>
                        <div className={sysStyles.text_field}>
                            <div className={sysStyles.text}>{"메뉴 순서"}</div>
                            {!editable ? (
                                <TextField id='menuOrder' defaultValue={selectedMenu.menuOrder} disabled={editable} variant='outlined' onChange={(e) => handleInputChange('menuOrder', e.target.value)} value={selectedMenu.menuOrder} sx={{width:"20rem"}}/>
                            ) : (
                            <TextField id='menuOrder' value={selectedMenu.menuOrder} disabled={editable} variant='outlined' sx={{width:"20rem", backgroundColor:"rgb(223,223,223)"}}/>
                            )}
                            
                        </div>
                        <div className={sysStyles.text_field}>
                            <div className={sysStyles.text}>{"접근 권한"}</div>
                            {!editable ? (
                                <Select placeholder={"접근 권한"} defaultValue={selectedMenu.accessUser} value={selectedMenu.accessUser} onChange={(value) => handleInputChange('accessUser', value)} style={{width:"20rem", height:"3.5rem", fontSize:"4rem"}}>
                                {access.map(option => (
                                    <Select.Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Select.Option>
                                ))}
                                </Select>
                            ):(
                                <TextField id='access' disabled={editable} variant='outlined' value={selectedMenu.accessUser} sx={{width:"20rem", backgroundColor:"rgb(223,223,223)"}}/>
                            )}
                            
                        </div>
                        {!editable && <Button variant='contained' onClick={handleSaveClick} sx={{width:"20rem", margin:"5rem auto"}}>저장</Button>}
                    </Card> 
                    <Card className={sysStyles.card_box} sx={{width:"38%", borderRadius:"15px"}}>
                        <div className={sysStyles.mid_title}>{"권한 부여 현황"}</div>
                        <TableCustom title='' data={res} />
                        {/* <DataGrid rows = {} columns={} /> */}
                    </Card>
                    </>
                ) : (
                    <Card className={sysStyles.card_box} sx={{width:"38%", borderRadius:"15px"}}>
                        <div className={sysStyles.mid_title}>{"권한 부여 현황"}</div>
                        <TableCustom title='' data={res} />
                    </Card>
                )}
                
            </div>
        </>
    );
}

