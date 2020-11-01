
const ParkingLotModel = require('../Models/ParkingLotModel').ParkingLot;
// const ModelAutoIncrementID = require('../Models/counterModel').autoIncrementModelID;

class Parking
{
    constructor()
    {
        $this.reserved_area = 20; //$this is in %;
        $this.total_lot = 120;
    }


    /**
     * Below method is create a lot operation.
     * By Default we have created 120 slots and first 20% lots reserved 
     * for Pregnent women and physically handicapped
     */
    async store(req, res)
    {
        const req_data = req.body;
        const bayArea = ['EAST', 'WEST', 'NORTH', 'SOUTH'];
        const total_lot = req_data.total_parking_lot ? req_data.total_parking_lot : this.total_lot;
        const res_arr = [];
        const lot_record_arr = [];
        let reserve_area = Math.round(($this.total_lot * $this.reserved_area) / 100);

        for (let x = 0; x < total_lot; x++) {
            var lotNumb = `P-${x + 1}`;
            let num = $this.randomNumber()
            const slot = new ParkingLotModel({
                id: x + 1,
                lot_number: lotNumb,
                is_reserved: reserve_area > 0 ? true : false,
                bay_area: bayArea[num],
                current_status: 'Available'
            });

            lot_record_arr.push(slot);
            reserve_area--;
        }


        const is_insterted = await $this.insert(lot_record_arr);
        if (!is_insterted) {
            res_arr.push({ error: is_insterted });
        } else {
            res_arr.push({ success: `Inserted` })
        }

        return res.status(200).send({
            status: 200,
            message: "Operation Completed",
            data: res_arr
        }).end();

    }

    async insert(slots)
    {
        return await ParkingLotModel.insertMany(slots).then((data) =>
        {
            return data;
        }).catch(err => err);
    }

    randomNumber(min = 0, max = 4)
    {
        return Math.floor(
            Math.random() * (max - min) + min
        )
    }

    fetchSlots(req, res)
    {

        const req_body = req.body;
        const is_reserved = req_body.user.disability ? req_body.user.disability : req_body.user.is_pregnent ? req_body.user.is_pregnent : false;

        ParkingLotModel.find({ is_reserved: is_reserved, current_status: 'Available', status: true },
            { status: false, created: false, __v: false, _id: false }).then(data =>
            {
                return res.status(200).send({
                    status: 200,
                    message: "Operation Completed",
                    data: data
                }).end();
            }).catch(err =>
            {
                return res.status(400).send({
                    status: 400,
                    message: `Error: ${err} `,
                }).end();
            })
    }

    updateSlotById()
    {

    }

    getSlotById(id = null)
    {
        if (id) {
            return ParkingLotModel.findOne({ id: id }).then(data =>
            {
                return data;
            }).catch(err =>
            {
                throw new Error(err);
            })
        }
    }
}

const $this = Parking.prototype;

module.exports = Parking;