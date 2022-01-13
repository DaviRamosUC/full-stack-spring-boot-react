import {useEffect, useRef, useState} from 'react'
import {getAllStudents, removeStudentById} from "./client";
import {errorNotification, successNotification} from './Notification'
import {Avatar, Badge, Breadcrumb, Button, Empty, Image, Layout, Menu, Popconfirm, Spin, Table, Tag,} from 'antd';
import {
    DesktopOutlined,
    FileOutlined,
    LoadingOutlined,
    PieChartOutlined,
    PlusOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';

import StudentDrawerForm from "./StudentDrawerForm";

import './App.css';

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const TheAvatar = ({name}) => {
    let trim = name.trim();
    if (trim.length === 0) {
        return <Avatar icon={<UserOutlined/>}/>
    }
    const split = trim.split(' ');
    if (split.length === 1) {
        return <Avatar>{name.charAt(0)}</Avatar>
    }
    return <Avatar>{name.charAt(0).toUpperCase()}{split[split.length - 1].charAt(0).toLowerCase()}</Avatar>
}

const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.name}/>,
        width: 100,
        align: 'center'
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => {
            return <>
                <Popconfirm
                    placement="topRight"
                    title={`Are you sure to delete ${record.name}`}
                    onConfirm={() => handleDelete(record, fetchStudents)}
                    okText="Yes"
                    cancelText="No">
                    <Button>Delete</Button>
                </Popconfirm>
                <Popconfirm
                    placement="topLeft"
                    title={'Edit'}
                    onConfirm={() => console.log('Confirm edit')}
                    okText="Yes"
                    cancelText="No">
                    <Button>Edit</Button>
                </Popconfirm>
            </>;
        }
    },
];

const handleDelete = (record, fetchStudents) => {
    removeStudentById(record.id).then(() => {
        fetchStudents();
        return successNotification(
            `Student ${record.name} deleted`,
            `Student with id ${record.id} was deleted`
        );
    }).catch(err => {
        err.response.json().then((res) => {
            errorNotification(
                `An error has occurred`,
                `[${res.error}, status: ${res.status}]`,
            )
        })
    });

}
const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                setStudents(data);
                setFetching(false);
            })
            .catch(err => {
                console.error(err.response);
                err.response.json().then(res => {
                    console.error(res);
                    errorNotification(
                        "There was an issue",
                        `${res.message} [${res.error}, status: ${res.status}]`,
                    )
                });
            }).finally(() => setFetching(false));

    useEffect(() => {
        fetchStudents();
    }, [])

    const btnAddStd = useRef(
        <Button
            onClick={() => setShowDrawer(!showDrawer)}
            type="primary"
            shape="round"
            icon={<PlusOutlined/>}
            size="small">
            Add New Student
        </Button>
    )

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>
        }
        if (students.length <= 0) {
            return <>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <div>
                    <Tag>Number of students</Tag>
                    <Badge
                        count={0}
                        showZero={true}
                    />
                    <br/><br/>
                    {btnAddStd.current}
                </div>
                <Empty style={{margin: "auto 25%"}}/>
            </>;
        }
        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Table
                dataSource={students}
                columns={columns(fetchStudents)}
                bordered
                title={() =>
                    <>
                        <Tag>Number of students</Tag>
                        <Badge
                            count={students.length}
                            className="site-badge-count-4 .ant-badge-count"
                        />
                        <br/><br/>
                        {btnAddStd.current}
                    </>
                }
                pagination={{pageSize: 50}}
                scroll={{y: 240}}
                rowKey={(student) => student.id}
            />
        </>
    }

    return (<Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div className="logo">
                    <h1 style={{color: "white"}}>LOGO</h1>
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" icon={<PieChartOutlined/>}>
                        Option 1
                    </Menu.Item>
                    <Menu.Item key="2" icon={<DesktopOutlined/>}>
                        Option 2
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
                        <Menu.Item key="3">Tom</Menu.Item>
                        <Menu.Item key="4">Bill</Menu.Item>
                        <Menu.Item key="5">Alex</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">
                        <Menu.Item key="6">Team 1</Menu.Item>
                        <Menu.Item key="8">Team 2</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="9" icon={<FileOutlined/>}>
                        Files
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 0}}/>
                <Content style={{margin: '0 16px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={students.length ? {padding: 24, minHeight: 360} : {
                        padding: 24,
                        minHeight: 360,
                        display: 'flex'
                    }}>
                        {renderStudents()}
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>
                    <div style={{display:"flex", alignItems: "center", justifyContent: "center"}}>
                        <Image
                            width={20}
                            src="https://user-images.githubusercontent.com/73002604/149333170-91d70a7e-9db6-4fef-aee4-52f4242ab419.png"
                        />
                        <p style={{margin: '0 3px'}}>By Davi Ramos ©2022</p>
                        <Image
                            width={20}
                            src="https://user-images.githubusercontent.com/73002604/149333170-91d70a7e-9db6-4fef-aee4-52f4242ab419.png"
                        />
                    </div>
                </Footer>
            </Layout>
        </Layout>
    );
}

export default App;
