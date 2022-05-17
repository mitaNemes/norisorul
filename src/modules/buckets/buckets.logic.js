export const parseFileData = (response) => {
    return response.map(elem => ({
        id: elem.metadata.id,
        contentType: elem.metadata.contentType,
        name:  elem.metadata.name,
        size: parseInt(elem.metadata.size),
        timeCreated: elem.metadata.timeCreated
    }))
}

export const parseBucketData = (response) => {
    console.log(response)
    const test = response.map(elem => ({
        id: elem.metadata.id,
        name:  elem.metadata.name,
        storageClass: elem.metadata.storageClass,
        location:  elem.metadata.location,
        timeCreated: elem.metadata.timeCreated
    }))

    return test
}

export const getFilesAndFolderName = (name) => {
    const pathExplode = name.split("/")

    switch (true) {
        case pathExplode.length > 1 && pathExplode[pathExplode.length - 1] !== "":
            // When we display a file name
            return pathExplode[pathExplode.length - 1]
        case pathExplode.length > 1 && pathExplode[pathExplode.length - 1] === "":
            // When we display a folder name
            return pathExplode[pathExplode.length - 2]
        case pathExplode.length === 1:
        default:
            // When a first level path under the feched bucket
            return name
    }
}

export const getFilesAndFolderToShow = (files, navigationPath) => {
    const pathElementToRemove = new Set(navigationPath);
    const displayedFilesAndFolders = [];

    files.forEach((file) => {
        //Split file path by '/' and remove from the path the elements present in the breadcrumb
        const pathExplode = file.name.split("/").filter(pathElement => !pathElementToRemove.has(pathElement))
        /*We should show only files that are at the current path level and have a valid name or folders
        * !pathExplode[1] && pathExplode[0] !== "" => files that are at this current level and have a valid name
        * pathExplode[1] === "" => folders
        */
        if ((!pathExplode[1] && pathExplode[0] !== "") || pathExplode[1] === "") {
            displayedFilesAndFolders.push(file)
        }
    })

    return displayedFilesAndFolders
}

export const isFolder = (type) => type === "text/plain"

export const getFolderPath = (navigationPath) => {
    //We need to remove the generic "Buckets" path and the bucket name and we don't want to mutate navigationPath state
    const cloneNavigationPath = [...navigationPath]
    cloneNavigationPath.splice(0, 2)

    return cloneNavigationPath.join('/')
}

export const getKBFileSize = (value) => (`${value / Math.pow(1024, 1)} KB`)

export const sortableTypes = {
    "name": false,
    "creationTime": false
}

export const sortBy = (list, order, orderBy) => {
    const toggleOrder = (value) => {
        /* For order i used a boolean to make it easier to toggle
        * order === false => asc
        * order === true => desc
        */
        const orderType = order ? -1 : 1
        return orderType * value
    }

    return list.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) { 
            return toggleOrder(-1); 
        }
        if (a[orderBy] > b[orderBy]) { 
            return toggleOrder(1); 
        }
        return 0;
    })
}