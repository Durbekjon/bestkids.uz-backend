async function incMemory(size) {
    try {
        const existingMemory = await Memory.findOne()
        if (!existingMemory || existingMemory.length === 0) {
            const newMem = new Memory({ total_size: size })
            await newMem.save()
        } else {
            existingMemory.total_size += size
            await existingMemory.save()
        }
    } catch (error) {
        console.log(error)
    }
}
async function decMemory(size) {
    try {
        const existingMemory = await Memory.findOne()
        existingMemory.total_size -= size
        await existingMemory.save()
    } catch (error) {
        console.log(error)
    }
}

export { incMemory, decMemory }
