import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";

function BradcrumbElement({ pathElem, index, breadcrumbsLength, setNavigationPath, navigationPath }) {
    const cloneNavigationPath = [...navigationPath]
    cloneNavigationPath.splice(index+1)

    return index === breadcrumbsLength
        ? (<div>
            {pathElem}
        </div>)
        : (<div onClick={() => setNavigationPath(cloneNavigationPath)}>{pathElem}</div>)

}

export default function BucketBradcrumb({ navigationPath, setNavigationPath }) {
    const breadcrumbs = navigationPath.map((pathElem, index) => {
        return <BradcrumbElement
            key={index}
            pathElem={pathElem}
            index={index}
            breadcrumbsLength={navigationPath.length}
            setNavigationPath={setNavigationPath}
            navigationPath={navigationPath} />
    })

    return (
        <Stack spacing={2}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
        </Stack>
    );
}
