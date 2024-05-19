import DataTable from "react-data-table-component";

const customStyles = {
  head: {
    style: {
      fontSize: "14px",
      fontWeight: 700,
    },
  },
  headRow: {
    style: {
      borderBottomWidth: "2px",
      borderBottomColor: "#00c3ff",
      borderBottomStyle: "solid",
    },
  },
};

export default function Table({ data, columns }) {
  const rows = data.map((obj) => {
    return { ...obj, id: obj.time };
  });

  return (
    <div className="table">
      <DataTable
        columns={columns}
        data={rows}
        responsive={true}
        fixedHeader={true}
        fixedHeaderScrollHeight="470px"
        customStyles={customStyles}
      />
    </div>
  );
}
