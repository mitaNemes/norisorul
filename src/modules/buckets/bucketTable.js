import React, { useState, useEffect } from "react";
import { sortBy, sortableTypes } from "./buckets.logic"
import { getGoogleCloudBucketList } from "./buckets.service"

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import moment from "moment";
import { text } from "../text";

function BucketRow({ bucket, navigationPath, setNavigationPath }) {
    return (<TableRow
        key={bucket.name}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell className="clickable" component="th" scope="row" onClick={() => setNavigationPath([...navigationPath, bucket.name])}>
            {bucket.name}
        </TableCell>
        <TableCell align="center">{bucket.location}</TableCell>
        <TableCell align="center">{bucket.storageClass}</TableCell>
        <TableCell align="right">{moment(bucket.timeCreated).format('lll')}</TableCell>
    </TableRow>)
}

export default function BucketTable({ navigationPath, setNavigationPath }) {
    const [googleCloudBuckets, setGoogleCloudBuckets] = useState([])
    const [order, setOrder] = useState(sortableTypes)
    const [orderBy, setOrderBy] = useState('name')

    useEffect(() => {
        handleSetGoogleCloudBuckets()
    }, [])

    useEffect(() => {
        if (googleCloudBuckets.length > 0) {
            const newList = sortBy([...googleCloudBuckets], order[orderBy], orderBy)
            setGoogleCloudBuckets(newList)
        }
    }, [order, orderBy])

    const handleSetGoogleCloudBuckets = async () => {
        const bucketList = await getGoogleCloudBucketList();
        setGoogleCloudBuckets(bucketList)
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
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className="clickable" onClick={() => handleSortClick("name")}>{text.bucketName}</TableCell>
                        <TableCell align="center">{text.location}</TableCell>
                        <TableCell align="center">{text.storageClass}</TableCell>
                        <TableCell className="clickable" onClick={() => handleSortClick("timeCreated")} align="right">{text.creationTime}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {googleCloudBuckets.map((bucket, index) => (<BucketRow key={index} bucket={bucket} navigationPath={navigationPath} setNavigationPath={setNavigationPath} />))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
