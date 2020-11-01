
const ParkingLotModel = require('../Models/ParkingLotModel').ParkingLot;
// const ModelAutoIncrementID = require('../Models/counterModel').autoIncrementModelID;
var $this = Parking.prototype;
function Parking()
{
    Parking.prototype.reserved_area = 20; //Parking.prototype is in %;
    Parking.prototype.total_lot = 120;
}

/**
 * Below method is create a lot operation.
 * By Default we have created 120 slots and first 20% lots reserved 
 * for Pregnent women and physically handicapped
 */
Parking.prototype.store = async function (req, res)
{
    const req_data = req.body;
    const bayArea = ['EAST', 'WEST', 'NORTH', 'SOUTH'];
    const total_lot = req_data.total_parking_lot ? req_data.total_parking_lot : this.total_lot;
    const res_arr = [];
    const lot_record_arr = []; 
    let reserve_area = Math.round( ($this.total_lot * $this.reserved_area)/100 );

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

Parking.prototype.insert = async function (slots)
{
    return await ParkingLotModel.insertMany(slots).then((data)=>{
        return data;
    }).catch(err=> err);
}

Parking.prototype.randomNumber = function (min = 0, max = 4)
{
    return Math.floor(
        Math.random() * (max - min) + min
    )
}


module.exports = Parking;