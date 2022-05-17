import React, { useState, useEffect } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { text } from "../text";

import { getFilesAndFolderName, isFolder, getFilesAndFolderToShow, getFolderPath, getKBFileSize, sortBy, sortableTypes } from "./buckets.logic"

import { getGoogleCloudBucketFiles, getGoogleCloudFile, downloadFile, uploadFile } from "./buckets.service"

function FileOrFolderRow({ file, navigationPath, setNavigationPath }) {
    const fileName = getFilesAndFolderName(file.name)
    const nameCell = isFolder(file?.contentType) 
        ? <div onClick={() => setNavigationPath([...navigationPath, fileName])}>{fileName}</div> 
        : <div onClick={() => downloadFile(navigationPath[1], fileName, file?.contentType)}>{fileName}</div>;

    return (<TableRow
        key={file.name}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell className="clickable" component="th" scope="row">
            {nameCell}
        </TableCell>
        <TableCell align="center">{file.contentType}</TableCell>
        <TableCell align="center">{getKBFileSize(file.size)}</TableCell>
        <TableCell align="right">{file.timeCreated}</TableCell>
    </TableRow>)
}

export default function BucketData({ navigationPath, setNavigationPath }) {
    const [selectedFile, setSelectedFile] = useState();
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false)
    const [googleCloudBucketFiles, setGoogleCloudBucketFiles] = useState([])
    const [order, setOrder] = useState(sortableTypes)
    const [orderBy, setOrderBy] = useState('name')

    useEffect(() => {
        getFilesFromBucket()
    }, [])

    useEffect(() => {
        if (navigationPath[navigationPath.length - 1] !== "") {
            getFilesFromFolder()
        }
    }, [navigationPath])

    useEffect(() => {
        if (googleCloudBucketFiles.length > 0) {
            const newList = sortBy([...googleCloudBucketFiles], order[orderBy], orderBy)
            setGoogleCloudBucketFiles(newList)
        }
    }, [order, orderBy])

    const getFilesFromBucket = async () => {
        const files = await getGoogleCloudBucketFiles(navigationPath[1])
        setGoogleCloudBucketFiles(getFilesAndFolderToShow(files, navigationPath, 1))
    }

    const getFilesFromFolder = async () => {
        const files = await getGoogleCloudFile(navigationPath[1], getFolderPath(navigationPath))
        setGoogleCloudBucketFiles(getFilesAndFolderToShow(files, navigationPath, 2))
    }

    const selectFile = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFileSelected(true)
    }

    const upload = () => {
        console.log(selectedFile)
        uploadFile(navigationPath[1], selectedFile)
    }

    const handleCloseModal = () => {
        setOpenAddModal(false)
        setSelectedFile()
        setIsFileSelected(false)
    }

    const handleSortClick = (sortedElem) => {
        if (orderBy !== sortedElem) {
            setOrderBy(sortedElem)
        }

        setOrder({
            ...order,
            [sortedElem]: !order[sortedElem]
        })
    }

    return (
        <div className="bucketData">
            <div className="bucketDataHeader">
                <h2>{navigationPath[1]}</h2>
                <Button
                    onClick={() => setOpenAddModal(true)}
                    variant="outlined"
                >
                    {text.plus}
                </Button>
            </div>

            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className="clickable" onClick={() => handleSortClick("name")} sortDirection={order.name}>{text.filePath}</TableCell>
                            <TableCell className="clickable" onClick={() => handleSortClick("contentType")} align="center">{text.type}</TableCell>
                            <TableCell className="clickable" onClick={() => handleSortClick("size")} align="center">{text.size}</TableCell>
                            <TableCell className="clickable" onClick={() => handleSortClick("timeCreated")} align="right">{text.creationTime}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {googleCloudBucketFiles.map((file, index) => (<FileOrFolderRow key={index} file={file} navigationPath={navigationPath} setNavigationPath={setNavigationPath} />))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={openAddModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className="bucketDataModal">
                        <div className="bucketDataInput">
                            <input type="file" name="file" onChange={selectFile} />
                            {
                                isFileSelected && (
                                    <>
                                        <p>{text.type}: {selectedFile.type}</p>
                                        <p>{text.size}: {getKBFileSize(selectedFile.size)}</p>
                                    </>
                                )
                            }
                        </div>

                        <div>
                            <Button
                                onClick={upload}
                                variant="outlined"
                                disabled={!isFileSelected}
                            >
                                {text.upload}
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
};