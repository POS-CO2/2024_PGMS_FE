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
    TreeItem2,
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
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, Divider, TextField } from '@mui/material';
import TableCustom from '../../TableCustom';
import { table_mm } from '../../assets/json/selectedPjt';
import * as mainStyle from '../../assets/css/main.css';
import { ConfigProvider, Input, Select } from 'antd';
import axiosInstance from '../../utils/AxiosInstance';
import Swal from 'sweetalert2';
import { menuTableColumns } from '../../assets/json/tableColumn';
import { ExpandMore, Public } from '@mui/icons-material';

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

const StyledTreeItem = styled(TreeItem2)(({theme}) => ({
    overflowY:"auto",
}));

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
            ? "#0eaa00"
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
        backgroundColor: "#e0f8f0", //alpha(theme.palette.primary.main, 0.1)
        color: theme.palette.mode === 'light' ? "#0eaa00" : 'white',
    },
    [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
    backgroundColor:
        theme.palette.mode === 'light'
            ? "#dcf9d9"
            : theme.palette.primary.dark,
        color: "#0eaa00",
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
            else if(!node.url) {
                treeItem.fileType = 'folder';
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


export default function Mm({menus, handleMenuSet}) {

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

    const [selectedMenu, setSelectedMenu] = useState([]);

    const clickMenuHandler = (e, item) => {
        setShowTable(true);
        const clickedItem = findMenuItemById(item, items); // items는 전체 메뉴 트리입니다.
        if (clickedItem) {
            // 상위 폴더 찾기
            const parrentDir = findParentFolder(item, items);
            const newMenuInfo = {
                id: item,
                originId: (clickedItem.originId) ?? 1,
                name: clickedItem.label, // 메뉴 이름
                parentDir: parrentDir ? parrentDir.label : '상위 폴더 없음', // 상위 폴더 이름
                parentDirId: (parrentDir ? parrentDir.originId : 0) ?? 1,
                menuOrder: clickedItem.menuOrder,
                accessUser: clickedItem.accessUser, // 접근 권한 (필요 시 다른 값을 설정)
                url: clickedItem.url,
            };
            setSelectedMenu(newMenuInfo); // 상태 업데이트
            handleEditClick(newMenuInfo);
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
        handleMenuSet();
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
    const handleEditClick = (e) => {
        (async () => {
            const {data} = await axiosInstance.get(`/sys/menu/cand?id=${selectedMenu.originId !== undefined ? (e.originId) : 1}`);
            setUpperDir(data);
        })();

        (async () => {
            const {data} = await axiosInstance.get(`/sys/menu/menu-order?id=${selectedMenu.parentDirId !== undefined ? (e.parentDirId) : 1}&isInsert=false`);
            data.sort();
            setMenuOrderList(data);
        })();
        
    }
    
    const [upperDir, setUpperDir] = useState([]);

    const [selectedUpperDir, setSelectedUpperDir] = useState('');
    const [menuOrderList, setMenuOrderList] = useState([]);
    const handleSaveClick = async () => {
        let swalOptions = {
            confirmButtonText: '확인'
        };

        const formData = {
            id: selectedMenu.originId,
            menuName: selectedMenu.name,
            rootId: selectedMenu.parentDirId === undefined ? 1 : selectedMenu.parentDirId,
            address: selectedMenu.url === "" ? null : selectedMenu.url,
            accessUser: selectedMenu.accessUser,
            menuOrder: selectedMenu.menuOrder
        }
        try {
            const {data} = await axiosInstance.patch('/sys/menu', formData);
            swalOptions.title = '성공!',
            swalOptions.text = `${formData.menuName}이 성공적으로 수정되었습니다.`;
            swalOptions.icon = 'success';
        } catch (error) {
            console.error(error);
            swalOptions.title = '실패!',
            swalOptions.text = `${formData.menuName} 등록에 실패하였습니다.`;
            swalOptions.icon = 'error';
        }
        handleMenuSet();
        Swal.fire(swalOptions);
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
    const findNameById = (id, upperDirArray) => {
        const item = upperDirArray.find(entry => entry.id === id);
        return item ? item : null; // 해당하는 항목이 없으면 `null`을 반환
    };

    const handleInputChangeText = (field, value) => {
        setSelectedMenu(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleInputChange = (field, value) => {
        const par = findNameById(value, upperDir)
        const parName = par.name;
        setSelectedUpperDir(par);
        setSelectedMenu(prevState => ({
            ...prevState,
            [field]: value,
            "parentDir": parName
        }));
    };
    useEffect(() => {
        if (selectedUpperDir) {
          // 서버에서 해당 selectedUpperDir에 맞는 menuOrderList를 가져오는 API 호출
            (async () => {
                const {data} = await axiosInstance.get(`/sys/menu/menu-order?id=${selectedUpperDir.id}&isInsert=false`);
                data.push(data.length+1);
                setMenuOrderList(data);
            })();
            
        } else {
          // selectedUpperDir가 비어있을 때는 menuOrderList를 초기화
            setMenuOrderList([]);
        }
    }, [selectedUpperDir]);
    menus.forEach(menu => parseMenu(menu.menu, menu.name, null));
    const [fpMenu, setFpMenu] = useState(res.filter(e => e.accessUser === "FP"));
    const [hpMenu, setHpMenu] = useState(res.filter(e => e.accessUser === "HP"));
    const [adminMenu, setAdminMenu] = useState(res.filter(e => e.accessUser === "ADMIN"));

    const [expanded, setExpanded] = useState();

    const handleExpanded = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    useEffect(() => {
        setFpMenu(res.filter(e => e.accessUser === "FP"));
        setHpMenu(res.filter(e => e.accessUser === "HP"));
        setAdminMenu(res.filter(e => e.accessUser === "ADMIN"));
    }, [res])

    return (
        <>
            <div className={mainStyle.breadcrumb}>
                {"시스템관리 > 메뉴 관리"}
            </div>
            <div className={sysStyles.main_grid}>
                <Card sx={{width:"25%", borderRadius:"15px", height:"88vh", overflowY:"auto"}}>
                <TableCustom title='' className={sysStyles.btn_group} buttons={['Add', 'Delete']} 
                onClicks={[handleAddClick,handleDeleteClick]} 
                table={false} 
                selectedRows={[selectedMenu]}
                modals={[
                    isModalOpen.MmAdd && {
                        "modalType" : 'MmAdd',
                        'isModalOpen': isModalOpen.MmAdd,
                        'handleOk': handleOk('MmAdd'),
                        'handleCancel': handleCancel('MmAdd'),
                        'rowData': selectedMenu,
                    },
                    isModalOpen.Delete && {
                        "modalType" : 'Delete',
                        'isModalOpen': isModalOpen.Delete,
                        'handleOk': handleOk('Delete'),
                        'handleCancel': handleCancel('Delete'),
                        'rowData': selectedMenu,
                        'rowDataName': "name",
                        'url': '/sys/menu',
                    },
                ].filter(Boolean)}/>
                <RichTreeView
                items={items}
                sx={{ height: 'fit-content', flexGrow: 1, maxWidth: 400, overflowY: 'hidden', width:"80%", margin:"0 auto"}}
                slots={{ item: CustomTreeItem }}
                onItemClick={(e, item) => {clickMenuHandler(e, item);}}
                />
                </Card>
                {showtable ? (
                    /** 테이블 컴포넌트 하나 생성해서 할당 */
                    /** 권한 부여 현황 어케 할건지 및 등록, 수정화면 필요 */
                    <>
                    <Card className={sysStyles.card_box} sx={{width:"25%", height:"88vh", borderRadius:"15px"}}>
                        <TableCustom 
                            table={false} 
                            title={"메뉴 정보"} 
                            buttons={['DoubleClickEdit']} 
                            onClicks={[handleSaveClick]}
                        />
                        <div className={sysStyles.text_field} style={{marginTop:"2rem"}}>
                            <div className={sysStyles.text}>
                                {"메뉴 이름"}
                            </div>
                            <Input id='menuName' value={selectedMenu.name} onChange={(e) => handleInputChangeText('name', e.target.value)} label="메뉴명" style={{width:"18rem", marginTop:"0.5rem"}} />
                        </div>
                        <div className={sysStyles.text_field}>
                            <div className={sysStyles.text}>{"상위 폴더"}</div>
                                <Select value={selectedMenu.parentDir} onChange={(e) => {handleInputChange('parentDirId', e);}} style={{marginTop:"0.5rem",width:"18rem", height:"2rem", fontSize:"4rem"}}>
                                {upperDir.map(option => (
                                    <Select.Option key={option.id} value={option.id}>
                                        {option.name}
                                    </Select.Option>
                                ))}
                                </Select>
                        </div>
                        <div className={sysStyles.text_field}>
                            <div className={sysStyles.text}>{"Url 주소"}</div>
                            <Input id='address' value={selectedMenu.url} onChange={(e) => handleInputChangeText('url', e.target.value)} label="Url" style={{width:"18rem", marginTop:"0.5rem"}} />
                        </div>
                        <div className={sysStyles.text_field}>
                            <div className={sysStyles.text}>{"메뉴 순서"}</div>
                            <Select value={selectedMenu.menuOrder} onChange={(e) => handleInputChangeText('menuOrder', e)} style={{marginTop:"0.5rem",width:"18rem", height:"2rem", fontSize:"4rem"}}>
                            {menuOrderList.map(option => (
                                <Select.Option key={option} value={option}>
                                    {option}
                                </Select.Option>
                            ))}
                            </Select>
                        </div>
                        <div className={sysStyles.text_field}>
                            <div className={sysStyles.text}>{"접근 권한"}</div>
                            <Select placeholder={"접근 권한"} defaultValue={selectedMenu.accessUser} value={selectedMenu.accessUser} onChange={(value) => handleInputChangeText('accessUser', value)} style={{marginTop:"0.5rem",width:"18rem", height:"2rem", fontSize:"4rem"}}>
                            {access.map(option => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                            </Select>
                        </div>
                    </Card> 
                    <Card className={sysStyles.card_box} sx={{width:"50%", borderRadius:"15px", height:"88vh", overflowY:"auto", paddingBottom:"1rem"}}>
                        <TableCustom title='권한 부여 현황' table={false}/>
                        <div className={sysStyles.accodion}>
                        <Accordion expanded={expanded === 'panel1'} onChange={handleExpanded('panel1')}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                                sx={{
                                    bgcolor: expanded === 'panel1' ? '#dcf9d9' : 'transparent', // 확장 상태일 때
                                    '&:hover': {
                                        bgcolor: '#e0f8f0', // hover 시
                                        color:"#0eaa00"
                                    },
                                    color: expanded === 'panel1' ? '#0eaa00' : "black",
                                    fontSize:"1.2rem",
                                    fontWeight:"bold",
                                }}
                            >
                                현장담당자
                            </AccordionSummary>
                            {fpMenu.map((e) => {
                                if (e.level === 2) {
                                    return (
                                        <>
                                        <Divider />
                                        <AccordionDetails sx={{marginLeft:"2rem", display:"flex", flexDirection:"column"}}>
                                            <div style={{display:"flex", flexDirection:"row", alignItems:"center", gap:"0.6rem"}}>
                                                <div style={{fontSize:"1.2rem"}}>
                                                {`${e.name}`}
                                                </div>
                                                <div style={{fontSize:"0.8rem", color:"gray"}}>
                                                {`( ${e.bd} > ${e.md} ) `} 
                                                </div>
                                            
                                            </div>
                                            <div style={{display:"flex"}}>
                                            <Public sx={{color:"green", marginRight:"0.6rem"}}/>{` : ${e.url}`}
                                            </div>
                                        </AccordionDetails>
                                        </>
                                    );
                                }
                                else if (e.level === 3) {
                                    return (
                                        <>
                                        <Divider />
                                        <AccordionDetails sx={{marginLeft:"2rem"}}>
                                            <div style={{display:"flex", flexDirection:"row", alignItems:"center", gap:"0.6rem"}}>
                                                <div style={{fontSize:"1.2rem"}}>
                                                {`${e.name}`}
                                                </div>
                                                <div style={{fontSize:"0.8rem", color:"gray"}}>
                                                {`( ${e.bd} > ${e.md} > ${e.sd} ) `} 
                                                </div>
                                            
                                            </div>
                                            <div style={{display:"flex"}}>
                                            <Public sx={{color:"green", marginRight:"0.6rem"}}/>{` : ${e.url}`}
                                            </div>
                                        </AccordionDetails>
                                        </>
                                    );
                                }
                            })}
                            </Accordion>
                            <Accordion expanded={expanded === 'panel2'} onChange={handleExpanded('panel2')}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                                sx={{
                                    bgcolor: expanded === 'panel2' ? '#dcf9d9' : 'transparent', // 확장 상태일 때
                                    '&:hover': {
                                        bgcolor: '#e0f8f0', // hover 시
                                        color:"#0eaa00"
                                    },
                                    color: expanded === 'panel2' ? '#0eaa00' : "black",
                                    fontSize:"1.2rem",
                                    fontWeight:"bold",
                                }}
                            >
                                본사담당자
                            </AccordionSummary>
                            {hpMenu.map((e) => {
                                if (e.level === 2) {
                                    return (
                                        <>
                                        <Divider />
                                        <AccordionDetails sx={{marginLeft:"2rem", display:"flex", flexDirection:"column"}}>
                                            <div style={{display:"flex", flexDirection:"row", alignItems:"center", gap:"0.6rem"}}>
                                                <div style={{fontSize:"1.2rem"}}>
                                                {`${e.name}`}
                                                </div>
                                                <div style={{fontSize:"0.8rem", color:"gray"}}>
                                                {`( ${e.bd} > ${e.md} ) `} 
                                                </div>
                                            
                                            </div>
                                            <div style={{display:"flex"}}>
                                            <Public sx={{color:"green", marginRight:"0.6rem"}}/>{` : ${e.url}`}
                                            </div>
                                        </AccordionDetails>
                                        </>
                                    );
                                }
                                else if (e.level === 3) {
                                    return (
                                        <>
                                        <Divider />
                                        <AccordionDetails sx={{marginLeft:"2rem"}}>
                                            <div style={{display:"flex", flexDirection:"row", alignItems:"center", gap:"0.6rem"}}>
                                                <div style={{fontSize:"1.2rem"}}>
                                                {`${e.name}`}
                                                </div>
                                                <div style={{fontSize:"0.8rem", color:"gray"}}>
                                                {`( ${e.bd} > ${e.md} > ${e.sd} ) `} 
                                                </div>
                                            
                                            </div>
                                            <div style={{display:"flex"}}>
                                            <Public sx={{color:"green", marginRight:"0.6rem"}}/>{` : ${e.url}`}
                                            </div>
                                        </AccordionDetails>
                                        </>
                                    );
                                }
                            })}
                            </Accordion>
                            <Accordion expanded={expanded === 'panel3'} onChange={handleExpanded('panel3')}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel3bh-content"
                                id="panel3bh-header"
                                sx={{
                                    bgcolor: expanded === 'panel3' ? '#dcf9d9' : 'transparent', // 확장 상태일 때
                                    '&:hover': {
                                        bgcolor: '#e0f8f0', // hover 시
                                        color:"#0eaa00"
                                    },
                                    color: expanded === 'panel3' ? '#0eaa00' : "black",
                                    fontSize:"1.2rem",
                                    fontWeight:"bold",
                                }}
                            >
                                시스템관리자
                            </AccordionSummary>
                            {adminMenu.map((e) => {
                                if (e.level === 2) {
                                    return (
                                        <>
                                        <Divider />
                                        <AccordionDetails sx={{marginLeft:"2rem", display:"flex", flexDirection:"column"}}>
                                            <div style={{display:"flex", flexDirection:"row", alignItems:"center", gap:"0.6rem"}}>
                                                <div style={{fontSize:"1.2rem"}}>
                                                {`${e.name}`}
                                                </div>
                                                <div style={{fontSize:"0.8rem", color:"gray"}}>
                                                {`( ${e.bd} > ${e.md} ) `} 
                                                </div>
                                            
                                            </div>
                                            <div style={{display:"flex"}}>
                                            <Public sx={{color:"green", marginRight:"0.6rem"}}/>{` : ${e.url}`}
                                            </div>
                                        </AccordionDetails>
                                        </>
                                    );
                                }
                                else if (e.level === 3) {
                                    return (
                                        <>
                                        <Divider />
                                        <AccordionDetails sx={{marginLeft:"2rem"}}>
                                            <div style={{display:"flex", flexDirection:"row", alignItems:"center", gap:"0.6rem"}}>
                                                <div style={{fontSize:"1.2rem"}}>
                                                {`${e.name}`}
                                                </div>
                                                <div style={{fontSize:"0.8rem", color:"gray"}}>
                                                {`( ${e.bd} > ${e.md} > ${e.sd} ) `} 
                                                </div>
                                            
                                            </div>
                                            <div style={{display:"flex"}}>
                                            <Public sx={{color:"green", marginRight:"0.6rem"}}/>{` : ${e.url}`}
                                            </div>
                                        </AccordionDetails>
                                        </>
                                    );
                                }
                            })}
                            </Accordion>
                            </div>
                    </Card>
                    </>
                ) : (
                    <Card className={sysStyles.card_box} sx={{width:"50%", borderRadius:"15px", height:"88vh"}}>
                        <TableCustom title='권한 부여 현황' table={false}/>
                    </Card>
                )}
                
            </div>
        </>
    );
}
