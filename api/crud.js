export async function multipartPOST(url, body) {
    
    try {
        const result = await fetch(url, {
            method: "POST",
            body: body
        });

        const response = await result.json();
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
    }

}

export async function GET(url) {
    try {
        const result = await fetch(url, {
            method: "GET"
        });

        const response = await result.json();
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export async function UPDATE(url, body) {
    try {
        const result = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(body)
        });

        const response = await result.json();
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
    }
}

export async function DELETE(url, body) {
    try {
        const result = await fetch(url, {
            method: "DELETE",
            body: JSON.stringify(body)
        });

        const response = await result.json();
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
    }
}