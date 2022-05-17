import React, { useState } from "react";
import "./buckets.scss";

import BucketTable from "./bucketTable"
import BucketData from "./bucketData";
import BucketBradcrumb from "./bucketBreadcrumb"



export default function BucketList() {
    const [navigationPath, setNavigationPath] = useState(["Buckets"])

    return <div className="bucketList">
        <BucketBradcrumb navigationPath={navigationPath} setNavigationPath={setNavigationPath} />
        <div className="bucketListContent">
            {navigationPath.length >= 2
                ? (<BucketData navigationPath={navigationPath} setNavigationPath={setNavigationPath} />)
                : (<BucketTable navigationPath={navigationPath} setNavigationPath={setNavigationPath} />)}
        </div>

    </div>;
}
