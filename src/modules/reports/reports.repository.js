const db = require("../../config/db");

exports.getDailySales = async () => {
  return db("sales_master")
    .select(
      db.raw("DATE(sale_date) as date"),
      db.raw("SUM(total_sale_amount) as total_sales")
    )
    .groupByRaw("DATE(sale_date)")
    .orderBy("date", "desc");
};

exports.getMonthlySales = async () => {
  return db("sales_master")
    .select(
      db.raw("TO_CHAR(sale_date, 'YYYY-MM') as month"),
      db.raw("SUM(total_sale_amount) as total_sales")
    )
    .groupBy("month")
    .orderBy("month", "desc");
};

exports.getYearlySales = async () => {
  return db("sales_master")
    .select(
      db.raw("EXTRACT(YEAR FROM sale_date) as year"),
      db.raw("SUM(total_sale_amount) as total_sales")
    )
    .groupBy("year")
    .orderBy("year", "desc");
};

exports.getSalesSummary = async (startDate, endDate) => {
  return db("sales_master as sm")
    .join("sales_items as si", "si.invoice_id", "sm.invoice_id")
    .join("stock_batches as sb", "sb.batch_id", "si.batch_id")
    .select(
      db.raw("COUNT(DISTINCT sm.invoice_id) as total_bills"),
      db.raw("SUM(sm.total_sale_amount) as total_sales"),
      db.raw("SUM(sm.total_gst_amount) as gst_collected"),
      db.raw(`
        SUM(
          (si.unit_price - sb.purchase_price) * si.quantity
        ) as net_profit
      `)
    )
    .whereRaw("DATE(sm.sale_date) BETWEEN ? AND ?", [
      startDate,
      endDate
    ]);
};

exports.getGenericWiseSales = async (startDate, endDate) => {
  const query = db("sales_items as si")
    .join("sales_master as sm", "sm.invoice_id", "si.invoice_id")
    .join("medicines as m", "m.medicine_id", "si.medicine_id")
    .select(
      "m.generic_name",
      db.raw("SUM(si.quantity) as total_units_sold"),
      db.raw("SUM(si.line_total) as total_sales"),
      db.raw("SUM(si.gst_amount) as total_gst"),
      db.raw(`
        SUM(
          (si.unit_price - sb.purchase_price) * si.quantity
        ) as net_profit
      `)
    )
    .join("stock_batches as sb", "sb.batch_id", "si.batch_id")
    .groupBy("m.generic_name")
    .orderBy("total_sales", "desc");

    if (startDate && endDate) {
        query.whereBetween("sm.sale_date", [
            `${startDate} 00:00:00`,
            `${endDate} 23:59:59`
        ]);
    }

  return query;
};